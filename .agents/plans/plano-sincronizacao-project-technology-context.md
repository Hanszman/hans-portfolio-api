# Plano — Sincronização automática Project ↔ TechnologyContext

## Contexto

Hoje a tabela `technology_context` (labels de uso/contexto por tecnologia — profissional, pessoal,
acadêmico, estudo — com data de início/fim, usada para calcular o "tempo de experiência" mostrado na
tela de Skills) é curada manualmente, sem nenhuma relação com os `Project`s que efetivamente usaram
aquela tecnologia. Ao mesmo tempo, `Project` já guarda `startDate`/`endDate`/`context` e uma relação
`technologies` (via `ProjectTechnology`) — ou seja, a informação para derivar contextos de uso já
existe, só não está sendo aproveitada.

O objetivo deste trabalho é:

1. Repopular `technology_context` do zero, gerando um registro por combinação
   `(project, technology relacionada)`, usando as datas e o `context` do próprio `Project`.
2. Passar a manter isso sincronizado **automaticamente**: toda vez que um `Project` for criado,
   atualizado (relações de tecnologia, datas ou contexto) ou excluído, os `technology_context`
   derivados dele devem ser criados/recriados/removidos junto, sem exigir nenhuma ação manual extra
   no admin.

Isso melhora a precisão das métricas de "tempo de experiência" por tecnologia (hoje calculadas em
`TechnologyExperienceMetricsService` a partir de `technology_context`, com merge de períodos
sobrepostos) e elimina o trabalho manual de manter esses contextos em dia conforme os projetos
mudam.

### Decisões já validadas com o usuário

- **Rastreabilidade**: `TechnologyContext` ganha uma nova coluna opcional `projectId` (FK para
  `Project`, `onDelete: Cascade`) para saber quais linhas foram geradas a partir de qual project —
  sem isso não dá pra reconciliar/apagar corretamente sem arriscar contextos curados manualmente.
  Como a FK usa `Cascade`, excluir um `Project` já remove automaticamente (no nível do banco) todos
  os `technology_context` que ele gerou — nenhuma lógica de aplicação extra é necessária para o caso
  de delete.
- **Datas obrigatórias**: `Project.startDate` passa a ser **obrigatório** no schema (hoje é
  opcional, mas não existe nenhum registro com o campo vazio). `endDate` continua opcional em ambas
  as tabelas (`Project` e `TechnologyContext`), e `TechnologyContext.startedAt` já era obrigatório —
  ou seja, depois dessa mudança as duas tabelas ficam com a mesma regra: início obrigatório, fim
  opcional.
- **Seed snapshot**: depois da migração de dados, o snapshot determinístico
  (`prisma/data/portfolio-seed.snapshot.json`) também será regenerado para refletir os novos
  registros de `technology_context`, mantendo `npm run prisma:seed` consistente com a realidade
  atual.

Nenhuma etapa deste plano inclui `git commit`, `git push`, aplicação de migration em produção ou
qualquer deploy — tudo fica pendente de revisão e autorização explícita do usuário.

## Achados relevantes da investigação (para contexto de quem for executar)

- `technology_context` **não é** um recurso registrado em `content-resource.config.ts`; é servido
  por um CRUD próprio (`TechnologyContextsController`/`TechnologyContextsService`, em
  `src/modules/content/{controllers,services}/technology-contexts/`), que fala direto com
  `PrismaService`, sem passar pela abstração genérica (`ContentAdminService`), e sem lógica de
  `sortOrder`.
- No CRUD genérico (`ContentAdminService.createAdminItem/updateAdminItem/deleteAdminItem`, em
  `src/modules/content/services/content-admin/content-admin.service.ts`), tudo roda dentro de um
  único `this.prisma.$transaction(...)`. O único precedente de "comportamento especial por recurso"
  hoje é `presentResourceItem`, que só decora a resposta de `technologies` (não escreve em outras
  tabelas). Vamos seguir esse mesmo padrão de branch por `resource === 'projects'`, mas escrevendo
  dentro da transação em vez de só decorar a leitura.
- Toda relação de array hoje (`ProjectTechnology`, e os `technologyContexts` aninhados dentro de
  `Technology`) usa semântica de **substituição total** no update: `deleteMany({}) + create([...])`
  (ver `content-mutation-payload.service.ts#buildTechnologyRelationMutation` e
  `#buildTechnologyContextMutation`). Vamos seguir essa mesma convenção para o sync de
  `technology_context` por project — mais simples, mais consistente, sem precisar inventar um diff
  de "quais tecnologias foram adicionadas/removidas" que hoje não existe em lugar nenhum do código.
- `ProjectContext` (enum do `Project`) e `TechnologyUsageContext` (enum do `TechnologyContext`) têm
  exatamente os mesmos valores (`PROFESSIONAL | PERSONAL | ACADEMIC | STUDY`), mas são dois tipos
  Prisma distintos — vai precisar de um mapeamento explícito (não dá pra só atribuir um no outro).
- `CreateTechnologyContextRequest` (contrato de `POST /admin/technology-contexts`) hoje **não tem**
  o validador `@IsContentEndDateOnOrAfterStartDate()` que todo outro DTO de intervalo de datas do
  projeto tem (`projects.request.ts`, `experiences.request.ts`, etc.) — é uma lacuna encontrada
  durante a investigação; vamos corrigi-la como parte deste trabalho (mesmo padrão, baixo risco).
- `prisma/seed.ts` hoje faz `technologyContext.createMany(...)` **antes** de popular `Project` — como
  agora várias linhas de `technology_context` vão referenciar `projectId`, a ordem do seed precisa
  mudar (technology_context só pode ser inserido depois de `Project`/`ProjectTechnology`).
- Não existe, em nenhum lugar do código, um sistema de eventos/hooks (`EventEmitter2`, middleware do
  Prisma, etc.) — qualquer sincronização automática vai ser código explícito, não declarativo.

---

## Fase 1 — Schema (`prisma/schema.prisma`)

1. `TechnologyContext`: adicionar `projectId String? @db.Uuid`, relação
   `project Project? @relation(fields: [projectId], references: [id], onDelete: Cascade)` e um
   índice `@@index([projectId])`.
2. `Project`: adicionar o lado inverso da relação, `technologyContexts TechnologyContext[]`.
3. `Project.startDate`: remover o `?` — passa de `DateTime? @db.Date` para `DateTime @db.Date`.
4. Nova migration (`prisma/migrations/<timestamp>_add_project_id_to_technology_context/migration.sql`),
   seguindo o padrão já usado no repositório (guard `DO $$ ... RAISE EXCEPTION` antes de qualquer
   `NOT NULL`, mesmo sabendo que hoje não há `project.start_date` nulo — é a mesma convenção
   defensiva das migrations anteriores):
   - `ALTER TABLE technology_context ADD COLUMN project_id UUID NULL;`
   - `ALTER TABLE technology_context ADD CONSTRAINT ... FOREIGN KEY (project_id) REFERENCES project(id) ON DELETE CASCADE;`
   - `CREATE INDEX ... ON technology_context (project_id);`
   - Guard `DO $$ BEGIN IF EXISTS (SELECT 1 FROM project WHERE start_date IS NULL) THEN RAISE EXCEPTION ...; END IF; END $$;`
   - `ALTER TABLE project ALTER COLUMN start_date SET NOT NULL;`
5. `npx prisma generate` depois da migration, para os tipos do Prisma Client refletirem os campos
   novos (lembrar do problema de `EPERM`/processo travando o `.dll` já visto antes — parar o
   `start:dev` antes de gerar).

## Fase 2 — Contratos e validação

1. `src/modules/content/contracts/technology-contexts/technology-contexts.request.ts`:
   - Adicionar `projectId?: string` (`@IsOptional() @IsUUID('4')`) em
     `CreateTechnologyContextRequest` e (via `PartialType`) em `UpdateTechnologyContextRequest`.
   - Adicionar `@IsContentEndDateOnOrAfterStartDate('startedAt')` em `endedAt` (usando o validador
     compartilhado já existente em `contracts/shared/content-date-range-validation.ts`, apontando
     para `startedAt` em vez do default `startDate`).
2. `src/modules/content/contracts/technology-contexts/technology-contexts.response.ts`: incluir
   `projectId` em `TechnologyContextRecordResponse`/`TechnologyContextMutationResponse` (nullable).
3. `src/modules/content/services/technology-contexts/technology-contexts.service.ts`: repassar
   `projectId` no `create`/`update` (mesmo padrão de campo opcional já usado para `endedAt`, com o
   `'projectId' in payload` check para permitir explicitamente `null`).
4. `src/modules/content/contracts/projects/projects.request.ts`: remover `@IsOptional()` de
   `startDate` em `CreateProjectRequest` (fica só `@IsDateString()`, obrigatório).
5. Novo helper de mapeamento de enum, por exemplo em
   `src/modules/content/services/project-technology-context-sync/project-context-mapping.helper.ts`:
   `mapProjectContextToTechnologyUsageContext(context: ProjectContext): TechnologyUsageContext`,
   switch exaustivo (não um cast), para deixar explícito e com erro em tempo de compilação se um dos
   enums divergir no futuro.

## Fase 3 — Serviço de sincronização automática

Novo serviço `ProjectTechnologyContextSyncService`
(`src/modules/content/services/project-technology-context-sync/project-technology-context-sync.service.ts`

- spec), injetado em `ContentAdminService`. Responsabilidades:

* `syncOnCreate(transaction, project)`: recebe o `Project` recém-criado já com `technologies`
  incluído (o mesmo retorno de `createAndReorder`, que já usa `PROJECT_INCLUDE`) e cria um
  `TechnologyContext` por tecnologia relacionada:
  `{ technologyId, projectId: project.id, context: mapProjectContextToTechnologyUsageContext(project.context), startedAt: project.startDate, endedAt: project.endDate ?? null }`.
* `syncOnUpdate(transaction, project, rawPayload)`: só age se o payload recebido (antes da
  transformação) contiver pelo menos um de `technologyRelations`, `startDate`, `endDate` ou
  `context` — nesses casos, apaga **todos** os `technology_context` com aquele `projectId`
  (`transaction.technologyContext.deleteMany({ where: { projectId: project.id } })`) e recria a
  partir do estado **já persistido** do project (o mesmo objeto retornado por `updateAndReorder`,
  que já inclui `technologies` atualizado) — nunca a partir do payload parcial recebido, para não
  precisar mesclar campo a campo. Se nenhum desses campos veio no payload, não faz nada (evita
  reescrever contextos em updates que só tocam título/resumo/etc.).
* Delete: nenhum código necessário — a FK `onDelete: Cascade` já limpa tudo quando o `Project` é
  excluído.
* Ambos os métodos recebem o `Prisma.TransactionClient` já aberto por `ContentAdminService`, então
  qualquer falha no sync desfaz o create/update do project inteiro (atomicidade garantida).

Ponto de integração em `content-admin.service.ts`: dentro do callback de `$transaction` de
`createAdminItem`/`updateAdminItem`, logo depois de `createAndReorder`/`updateAndReorder`
resolverem, adicionar:

```ts
if (resource === 'projects') {
  await this.projectTechnologyContextSyncService.syncOnCreate(
    transaction,
    result,
  );
  // ou syncOnUpdate(transaction, result, payload) no caso de update
}
```

(mesmo padrão de branch único por `resource` já usado em `presentResourceItem`, só que escrevendo em
vez de só decorar a leitura — mantém a lógica de sincronização isolada no novo serviço, sem inflar
`ContentAdminService` com regras de negócio de project).

## Fase 4 — Migração de dados (script único, sob autorização explícita para rodar)

Novo script `prisma/scripts/rebuild-technology-contexts-from-projects.ts` (rodado manualmente via
`ts-node`, nunca automaticamente), que:

1. Apaga todos os registros atuais de `technology_context`
   (`prisma.technologyContext.deleteMany()`) — só dados, sem tocar no schema/tabela.
2. Lê todos os `Project`s com `technologies` (via `ProjectTechnology` → `Technology`) incluídos.
3. Para cada project, para cada tecnologia relacionada, chama `POST /admin/technology-contexts` (o
   endpoint real, como pedido) com
   `{ technologyId, projectId: project.id, context: <mapeado>, startedAt: project.startDate, endedAt: project.endDate ?? null }`,
   autenticando como admin (reaproveitando o mesmo padrão de login usado pelo script de bootstrap de
   admin, lendo credenciais do `.env`).
4. Loga um resumo final (quantos criados, quantos projects sem tecnologia, erros).

Pré-requisito claramente documentado no próprio script: a API precisa estar rodando localmente
(`npm run start:dev`) antes de executar, já que ele fala com o endpoint HTTP real, não com o Prisma
direto (assim já exercita as validações novas da Fase 2 e a mesma lógica de negócio que qualquer
outro cliente usaria).

Depois de rodar o script com sucesso contra o banco de desenvolvimento, regenerar o snapshot com
`npm run prisma:seed:snapshot`, e então ajustar `prisma/seed.ts` para inserir `technologyContexts`
**depois** de `project`/`projectTechnology` (hoje é inserido antes — precisa mudar a ordem, já que
agora várias linhas referenciam `projectId`).

## Fase 5 — Consistência no hans-portfolio-app

- Confirmar que o formulário de criação de Project no admin
  (`projects-operations.types.ts`/`PROJECTS_OPERATIONS_FIELDS`) já marca `startDate` como campo
  obrigatório (`required: true`) — se não estiver, ajustar, já que a API vai passar a rejeitar
  `startDate` vazio.
- Revisar os tipos locais que hoje declaram `startDate` como opcional/nulo em `ProjectRecord`/
  `ProjectMutationPayload` (`hans-portfolio-app/src/app/core/api/projects/projects.types.ts`) e
  apertar para refletir a obrigatoriedade nova (mudança de tipo só, sem necessidade de UI nova).
- Nenhuma tela nova é necessária para `projectId` em `technology_context` — é um campo interno de
  rastreabilidade usado pelo sync automático e pelo script de migração, não algo que o admin precisa
  preencher manualmente pelo formulário de Technology Contexts.

## Fase 6 — Documentação e testes

- Atualizar `docs/database/initial-schema.md` e `docs/database/seed-snapshot.md` (novo campo
  `projectId`, `startDate` obrigatório, nova ordem de seed).
- Testes unitários novos/atualizados (mantendo a cobertura de 100% exigida pelo AGENTS.md):
  - `project-technology-context-sync.service.spec.ts` (create, update com cada campo-gatilho
    isoladamente, update sem nenhum campo-gatilho → no-op, project sem tecnologias).
  - `project-context-mapping.helper.spec.ts` (todos os valores do enum).
  - `content-admin.service.spec.ts`: estender o mock de transação existente com os delegates
    `project`/`technologyContext` e cobrir o novo branch `resource === 'projects'`.
  - `technology-contexts.request.spec.ts` (ou equivalente): cobrir o novo validador de datas e o
    campo `projectId` opcional.
- Testes e2e: cobrir criar/atualizar/excluir um `Project` com tecnologias relacionadas e verificar
  que `technology_context` reflete corretamente (inclusive o cascade no delete).
- Validação final em `hans-portfolio-api`: `npm run lint`, `npm run format:check`,
  `npm run test:coverage` (unit + e2e), `npm run build`, `npm run prisma:validate`,
  `npm run prisma:migrate:status`.
- Validação final em `hans-portfolio-app` (só os pontos tocados na Fase 5):
  `npm run lint`, `npm run test:coverage -- --watch=false`, `npm run build`.

## Verificação end-to-end (manual, via chrome-devtools como já vem sendo feito)

1. Rodar a migration localmente, confirmar `prisma:migrate:status` limpo.
2. Rodar o script de migração de dados (Fase 4) contra a API local e confirmar no admin
   (`GET /technology-contexts` e a tela de Skills) que os novos contextos aparecem e que as métricas
   de "tempo de experiência" continuam corretas (merge de períodos sobrepostos já testado antes).
3. No admin, criar um Project novo com 2+ tecnologias e datas — confirmar que aparecem
   `technology_context` novos automaticamente.
4. Editar esse Project (mudar uma tecnologia relacionada, mudar `endDate`, mudar `context`) —
   confirmar que os `technology_context` são recriados corretamente a cada mudança.
5. Editar apenas um campo não relacionado (ex.: título) — confirmar que **nada** muda em
   `technology_context` (sem churn desnecessário).
6. Excluir o Project — confirmar que os `technology_context` dele desaparecem (cascade) e que
   nenhum outro contexto (de outros projects ou curado manualmente) é afetado.

Nenhuma migration é aplicada em produção, nenhum commit é feito, e o script de repopulação de dados
só roda contra o ambiente de desenvolvimento local, tudo pendente de autorização explícita do
usuário antes de cada etapa sensível.

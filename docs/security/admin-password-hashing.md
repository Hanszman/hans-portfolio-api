# Admin password hashing

Admin passwords are stored as Argon2id hashes. The API generates a random salt for every hash and uses the OWASP baseline parameters:

- memory cost: `19456` KiB (19 MiB)
- time cost: `2`
- parallelism: `1`

The database stores only the encoded result in `user.passwordHash`. Never send the plaintext password to a website, online hash generator, chat, or committed file.

## Change or migrate the admin password

Use the repository bootstrap from a trusted terminal. It hashes inside the Back-End process and upserts the admin identified by `ADMIN_BOOTSTRAP_EMAIL`.

1. Confirm that `DATABASE_URL` and `DIRECT_URL` target the intended environment.
2. Set `ADMIN_BOOTSTRAP_NAME` and `ADMIN_BOOTSTRAP_EMAIL` to the existing admin identity.
3. Put the new plaintext password in `ADMIN_BOOTSTRAP_PASSWORD` using an ignored local `.env` file or the deployment secret manager. Do not put it directly in a shell command because command history may retain it.
4. Run `npm run prisma:admin:bootstrap` from `hans-portfolio-api`.
5. Confirm that the command reports that the existing admin was updated.
6. Log in through `POST /auth/login` or the admin screen with the new password.
7. Confirm `GET /admin/session` succeeds with the returned bearer token.
8. Remove the plaintext from temporary configuration, or retain it only in a protected secret store when automated bootstrap is intentional.

Rerunning the bootstrap replaces the current password hash with a new Argon2id hash. A fresh random salt means the encoded hash changes even when the plaintext stays the same.

## Repository clone and database access

The `ADMIN_BOOTSTRAP_*` variables alone do not authorize anything. The script is not exposed as an HTTP endpoint and must establish a direct database connection using valid `DATABASE_URL` credentials.

Someone who only clones the public source can create an admin in their own database, not in the portfolio database. Someone who obtains the real database credentials may be able to alter data directly, depending on that PostgreSQL role's privileges. Protect and rotate `DATABASE_URL`, `DIRECT_URL`, `PGPASSWORD`, and deployment secrets if exposure is suspected. Prefer separate least-privilege runtime and migration roles when the database provider supports them.

## Database, migrations, seeds, and snapshots

No Prisma migration is required. `passwordHash` is already a PostgreSQL `TEXT` column and accepts the Argon2id encoded value.

The versioned portfolio snapshot does not contain users or password hashes. `prisma:seed:reset` preserves the `user` table, while `prisma:seed` can run the same admin bootstrap when all `ADMIN_BOOTSTRAP_*` variables are configured. Changing the admin password therefore does not require regenerating the content snapshot or modifying seed data.

import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('hashes a plain password', async () => {
    const passwordHash = await service.hashPassword('ChangeMe!123');

    expect(passwordHash).toBeTruthy();
    expect(passwordHash).not.toBe('ChangeMe!123');
    expect(passwordHash).toMatch(/^\$argon2id\$v=19\$m=19456,p=1,t=2\$/);
  });

  it('matches a valid password against its hash', async () => {
    const passwordHash = await service.hashPassword('ChangeMe!123');

    await expect(
      service.matchesPassword('ChangeMe!123', passwordHash),
    ).resolves.toBe(true);
  });

  it('rejects an invalid password against its hash', async () => {
    const passwordHash = await service.hashPassword('ChangeMe!123');

    await expect(
      service.matchesPassword('WrongPassword!123', passwordHash),
    ).resolves.toBe(false);
  });

  it('rejects a hash produced by an unsupported legacy algorithm', async () => {
    await expect(
      service.matchesPassword(
        'ChangeMe!123',
        '$2b$12$legacy-bcrypt-hash-is-not-accepted',
      ),
    ).resolves.toBe(false);
  });

  it('rejects a malformed Argon2id hash', async () => {
    await expect(
      service.matchesPassword('ChangeMe!123', '$argon2id$malformed'),
    ).resolves.toBe(false);
  });
});

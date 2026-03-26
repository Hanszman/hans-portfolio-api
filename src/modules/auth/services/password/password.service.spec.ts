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
});

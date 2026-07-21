import { AdminJwtAuthGuard } from './admin-jwt-auth.guard';

describe('AdminJwtAuthGuard', () => {
  it('extends the passport jwt auth guard', () => {
    const guard = new AdminJwtAuthGuard();

    expect(guard).toBeInstanceOf(AdminJwtAuthGuard);
    expect(AdminJwtAuthGuard.name).toBe('AdminJwtAuthGuard');
  });
});

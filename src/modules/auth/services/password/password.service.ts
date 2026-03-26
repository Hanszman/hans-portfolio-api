import { Injectable } from '@nestjs/common';
import { compare, hash } from 'bcrypt';

@Injectable()
export class PasswordService {
  private static readonly SALT_ROUNDS = 12;

  async hashPassword(password: string): Promise<string> {
    return hash(password, PasswordService.SALT_ROUNDS);
  }

  async matchesPassword(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    return compare(plainPassword, passwordHash);
  }
}

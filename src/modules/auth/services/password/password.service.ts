import { Injectable } from '@nestjs/common';
import { argon2id, hash, verify, type HashOptions } from 'argon2';

@Injectable()
export class PasswordService {
  private static readonly ARGON2ID_HASH_PREFIX = '$argon2id$';
  private static readonly ARGON2ID_OPTIONS: HashOptions & { raw: false } = {
    type: argon2id,
    memoryCost: 19_456,
    timeCost: 2,
    parallelism: 1,
    raw: false,
  };

  async hashPassword(password: string): Promise<string> {
    return hash(password, PasswordService.ARGON2ID_OPTIONS);
  }

  async matchesPassword(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    if (!passwordHash.startsWith(PasswordService.ARGON2ID_HASH_PREFIX)) {
      return false;
    }

    try {
      return await verify(passwordHash, plainPassword);
    } catch {
      return false;
    }
  }
}

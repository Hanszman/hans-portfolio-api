import { Injectable } from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { argon2id, argon2Verify, type IArgon2Options } from 'hash-wasm';

@Injectable()
export class PasswordService {
  private static readonly ARGON2ID_HASH_PREFIX = '$argon2id$';
  private static readonly ARGON2ID_SALT_LENGTH = 16;
  private static readonly ARGON2ID_OPTIONS: Pick<
    IArgon2Options,
    'hashLength' | 'iterations' | 'memorySize' | 'parallelism'
  > = {
    hashLength: 32,
    iterations: 2,
    memorySize: 19_456,
    parallelism: 1,
  };

  async hashPassword(password: string): Promise<string> {
    return argon2id({
      password,
      salt: randomBytes(PasswordService.ARGON2ID_SALT_LENGTH),
      ...PasswordService.ARGON2ID_OPTIONS,
      outputType: 'encoded',
    });
  }

  async matchesPassword(
    plainPassword: string,
    passwordHash: string,
  ): Promise<boolean> {
    if (!passwordHash.startsWith(PasswordService.ARGON2ID_HASH_PREFIX)) {
      return false;
    }

    try {
      return await argon2Verify({
        hash: passwordHash,
        password: plainPassword,
      });
    } catch {
      return false;
    }
  }
}

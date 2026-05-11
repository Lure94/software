import { Injectable } from '@nestjs/common';
import { argon2id, hash, verify } from 'argon2';

@Injectable()
export class HashService {
  async hash(password: string): Promise<string> {
    return hash(password, {
      type: argon2id,
    });
  }

  async verify(hashed: string, plain: string): Promise<boolean> {
    return verify(hashed, plain);
  }
}

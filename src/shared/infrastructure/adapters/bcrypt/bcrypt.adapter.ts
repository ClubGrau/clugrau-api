import bcrypt from 'bcrypt';
import { EncrypterPort } from '../../../application/ports/encrypter.port';

export class BcryptAdapter implements EncrypterPort {
  async encrypt(value: string): Promise<string> {
    const salt = 10;
    const hashedValue = await bcrypt.hash(value, salt);
    return hashedValue;
  }
}

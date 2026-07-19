import { AuthenticatableUser } from '@modules/auth/domain/models/authenticatable-user.model';

export interface FindAuthenticatableByEmailPort {
  findAuthenticatableByEmail(
    email: string,
  ): Promise<AuthenticatableUser | null>;
}

import { FindAuthenticatableByEmailPort } from '@modules/auth/application/ports/outbound/find-authenticable-by-email.port';
import { LoginDto, LoginResultDto } from '../dtos/login.dto';
import { AuthenticationError } from '@modules/auth/domain/errors/auth.errors';

export class LoginUseCase {
  constructor(
    private readonly findAuthenticatableByEmailPort: FindAuthenticatableByEmailPort,
  ) {}

  async execute(params: LoginDto): Promise<LoginResultDto> {
    const user =
      await this.findAuthenticatableByEmailPort.findAuthenticatableByEmail(
        params.email,
      );

    if (!user) {
      throw new AuthenticationError();
    }

    return { token: 'valid_token' };
  }
}

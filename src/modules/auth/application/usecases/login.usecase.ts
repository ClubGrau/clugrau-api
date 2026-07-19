import { FindAuthenticatableByEmailPort } from '@modules/auth/application/ports/outbound/find-authenticable-by-email.port';

export class LoginUseCase {
  constructor(
    private readonly findAuthenticatableByEmailPort: FindAuthenticatableByEmailPort,
  ) {}

  async execute(params: {
    email: string;
    password: string;
  }): Promise<{ token: string }> {
    await this.findAuthenticatableByEmailPort.findAuthenticatableByEmail(
      params.email,
    );
    return { token: 'valid_token' };
  }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingParamError } from '@shared/presentation/errors/missing-param.error';

interface LoginDto {
  email: string;
  password: string;
}

export class AuthController {
  handle(request: LoginDto): any {
    if (!request.email) {
      return {
        statusCode: 400,
        body: new MissingParamError('email'),
      };
    }
  }
}

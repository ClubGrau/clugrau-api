import { MissingParamError } from '@shared/presentation/errors/missing-param.error';
import { AuthController } from './auth.controller';

const makeSut = () => {
  const sut = new AuthController();
  return {
    sut,
  };
};

describe('AuthController', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(AuthController);
  });

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const request = {
      email: '',
      password: 'any_password',
    };
    const httpResponse = sut.handle(request);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const request = {
      email: 'any_email@example.com',
      password: '',
    };
    const httpResponse = sut.handle(request);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
});

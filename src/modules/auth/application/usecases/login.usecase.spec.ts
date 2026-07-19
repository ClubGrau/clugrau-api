import { FindAuthenticatableByEmailPort } from '../ports/outbound/find-authenticable-by-email.port';
import { LoginUseCase } from './login.usecase';

const makeStubs = () => ({
  findAuthenticatableByEmailPortStub: {
    findAuthenticatableByEmail: jest.fn().mockResolvedValue({
      id: 'any_id',
      name: 'John Doe',
      email: 'any_email@example.com',
      passwordHash: 'hashed_password',
      isActive: true,
      role: 'EMPLOYEE',
    }),
  } satisfies FindAuthenticatableByEmailPort,
});

const makeSut = (): SutTypes => {
  const { findAuthenticatableByEmailPortStub } = makeStubs();
  const sut = new LoginUseCase(findAuthenticatableByEmailPortStub);
  return {
    sut,
    findAuthenticatableByEmailPortStub,
  };
};

type SutTypes = {
  sut: LoginUseCase;
  findAuthenticatableByEmailPortStub: FindAuthenticatableByEmailPort;
};

describe('LoginUsecase', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(LoginUseCase);
  });

  it('should call FindAuthenticatableByEmailPort with correct values', async () => {
    const { sut, findAuthenticatableByEmailPortStub } = makeSut();
    const params = {
      email: 'any_email@example.com',
      password: 'any_password',
    };

    const findAuthenticatableByEmailSpy = jest.spyOn(
      findAuthenticatableByEmailPortStub,
      'findAuthenticatableByEmail',
    );
    await sut.execute(params);
    expect(findAuthenticatableByEmailSpy).toHaveBeenCalledWith(params.email);
  });
});

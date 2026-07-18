import { LoginUseCase } from './login.usecase';

const makeSut = (): SutTypes => {
  const sut = new LoginUseCase();
  return {
    sut,
  };
};

type SutTypes = {
  sut: LoginUseCase;
};

describe('LoginUsecase', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(LoginUseCase);
  });
});

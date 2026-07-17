import { HireEmployeeUsecase } from './hire-employee.usecase';

const makeSut = (): SutTypes => {
  const sut = new HireEmployeeUsecase();
  return { sut };
};

type SutTypes = {
  sut: HireEmployeeUsecase;
};

describe('HireEmployeeUsecase', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(HireEmployeeUsecase);
  });
});

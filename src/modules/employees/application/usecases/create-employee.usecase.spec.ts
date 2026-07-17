import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { CreateEmployeeUsecase } from './create-employee.usecase';
import { PasswordNotMatchError } from '@modules/employees/domain/errors/employee.errors';
import { Employee } from '@modules/employees/domain/entities/Employee';
import {
  InvalidEmailError,
  InvalidNameError,
  InvalidPasswordError,
} from '@shared/domain/value-object';

const makeSut = (): SutTypes => {
  const sut = new CreateEmployeeUsecase();
  return { sut };
};

const makeValidParams = (
  overrides: Partial<EmployeeModel.CreateEmployeeDto> = {},
): EmployeeModel.CreateEmployeeDto => ({
  name: 'John Doe',
  email: 'john.doe@example.com',
  role: EmployeeModel.Role.MANAGER,
  password: 'P@ssword123',
  passwordConfirmation: 'P@ssword123',
  ...overrides,
});

type SutTypes = {
  sut: CreateEmployeeUsecase;
};

describe('HireEmployeeUsecase', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CreateEmployeeUsecase);
  });

  it('should expose a execute method', () => {
    const { sut } = makeSut();
    expect(sut.execute).toBeDefined();
    expect(sut.execute).toBeInstanceOf(Function);
  });

  it('should return an error if password and passwordConfirmation do not match', async () => {
    const { sut } = makeSut();
    const params = makeValidParams({
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword456',
    });

    const execute = () => sut.execute(params);
    await expect(execute).rejects.toBeInstanceOf(PasswordNotMatchError);
    await expect(execute).rejects.toThrow(
      'Password and passwordConfirmation do not match',
    );
  });

  it('should not create an employee when passwords do not match', async () => {
    const { sut } = makeSut();
    const createSpy = jest.spyOn(Employee, 'create');
    const params = makeValidParams({
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword456',
    });

    await expect(sut.execute(params)).rejects.toBeInstanceOf(
      PasswordNotMatchError,
    );
    expect(createSpy).not.toHaveBeenCalled();
  });

  describe('Employee entity creation', () => {
    it('should create an Employee from the mapped dto fields', async () => {
      const { sut } = makeSut();
      const createSpy = jest.spyOn(Employee, 'create');

      await sut.execute(makeValidParams());

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john.doe@example.com',
        role: EmployeeModel.Role.MANAGER,
        password: 'P@ssword123',
      });
    });

    it('should forward the optional nif to Employee.create', async () => {
      const { sut } = makeSut();
      const createSpy = jest.spyOn(Employee, 'create');

      await sut.execute(makeValidParams({ nif: 123456789 }));

      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({ nif: 123456789 }),
      );
    });

    it('should resolve when params are valid', async () => {
      const { sut } = makeSut();
      await expect(sut.execute(makeValidParams())).resolves.toBeUndefined();
    });
  });

  describe('domain validation propagation', () => {
    it('should propagate an error for an invalid name', async () => {
      const { sut } = makeSut();
      const execute = () => sut.execute(makeValidParams({ name: 'A' }));

      await expect(execute).rejects.toBeInstanceOf(InvalidNameError);
    });

    it('should propagate an error for an invalid email', async () => {
      const { sut } = makeSut();
      const execute = () =>
        sut.execute(makeValidParams({ email: 'not-an-email' }));

      await expect(execute).rejects.toBeInstanceOf(InvalidEmailError);
    });

    it('should propagate an error for a weak password', async () => {
      const { sut } = makeSut();
      const execute = () =>
        sut.execute(
          makeValidParams({ password: 'weak', passwordConfirmation: 'weak' }),
        );

      await expect(execute).rejects.toBeInstanceOf(InvalidPasswordError);
    });
  });
});

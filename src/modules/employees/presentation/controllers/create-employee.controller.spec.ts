import { CreateEmployeeUsecase } from '@modules/employees/application/usecases/create-employee.usecase';
import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { MissingParamError } from '@shared/presentation/errors/missing-param.error';
import { CreateEmployeeController } from './create-employee.controller';

const makeStubs = () => ({
  createEmployeeUsecaseStub: {
    execute: jest.fn().mockResolvedValue({ id: 'valid_employee_id' }),
  } as unknown as CreateEmployeeUsecase,
});

const makeSut = (): SutTypes => {
  const { createEmployeeUsecaseStub } = makeStubs();
  const sut = new CreateEmployeeController(createEmployeeUsecaseStub);
  return { sut, createEmployeeUsecaseStub };
};

type SutTypes = {
  sut: CreateEmployeeController;
  createEmployeeUsecaseStub: CreateEmployeeUsecase;
};

describe('CreateEmployeeController', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CreateEmployeeController);
  });

  it('should return 400 if name is not provided', async () => {
    const { sut } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: '',
      email: 'test@test.com',
      role: EmployeeModel.Role.EMPLOYEE,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword456',
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: new MissingParamError('name').message,
    });
  });

  it('should return 400 if email is not provided', async () => {
    const { sut } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: '',
      role: EmployeeModel.Role.EMPLOYEE,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword456',
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: new MissingParamError('email').message,
    });
  });

  it('should return 400 if password is not provided', async () => {
    const { sut } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: 'test@test.com',
      role: EmployeeModel.Role.EMPLOYEE,
      password: '',
      passwordConfirmation: 'P@ssword456',
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: new MissingParamError('password').message,
    });
  });

  it('should return 400 if passwordConfirmation is not provided', async () => {
    const { sut } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: 'test@test.com',
      role: EmployeeModel.Role.EMPLOYEE,
      password: 'P@ssword123',
      passwordConfirmation: '',
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: new MissingParamError('passwordConfirmation').message,
    });
  });

  it('should call CreateEmployeeUsecase with correct values', async () => {
    const { sut, createEmployeeUsecaseStub } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: 'test@test.com',
      role: EmployeeModel.Role.EMPLOYEE,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const createEmployeeUsecaseSpy = jest.spyOn(
      createEmployeeUsecaseStub,
      'execute',
    );
    await sut.handle(request);
    expect(createEmployeeUsecaseSpy).toHaveBeenCalledWith(request);
  });

  it('should return 500 if CreateEmployeeUsecase throws', async () => {
    const { sut, createEmployeeUsecaseStub } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: 'test@test.com',
      role: EmployeeModel.Role.EMPLOYEE,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const createEmployeeUsecaseSpy = jest
      .spyOn(createEmployeeUsecaseStub, 'execute')
      .mockRejectedValue(new Error('CreateEmployeeUsecase error'));
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: 'CreateEmployeeUsecase error',
    });
    expect(createEmployeeUsecaseSpy).toHaveBeenCalledWith(request);
  });

  it('should return 201 if employee is created successfully', async () => {
    const { sut } = makeSut();
    const request: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: 'test@test.com',
      role: EmployeeModel.Role.EMPLOYEE,
      password: 'P@ssword123',
      passwordConfirmation: 'P@ssword123',
    };
    const response = await sut.handle(request);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      data: { id: 'valid_employee_id' },
    });
  });
});

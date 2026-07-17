import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { CreateEmployeeController } from './create-employee.controller';

const makeSut = (): SutTypes => {
  const sut = new CreateEmployeeController();
  return { sut };
};

type SutTypes = {
  sut: CreateEmployeeController;
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
      error: 'Missing param name',
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
      error: 'Missing param email',
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
      error: 'Missing param password',
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
      error: 'Missing param passwordConfirmation',
    });
  });
});

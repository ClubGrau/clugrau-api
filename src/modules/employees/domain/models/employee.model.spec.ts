import { EmployeeModel } from './employee.model';

describe('EmployeeModel.Role', () => {
  it('should expose all roles', () => {
    expect(EmployeeModel.ROLES).toEqual(['ADMIN', 'MANAGER', 'EMPLOYEE']);
  });

  it('should identify valid roles', () => {
    expect(EmployeeModel.isRole('ADMIN')).toBe(true);
    expect(EmployeeModel.isRole(EmployeeModel.Role.MANAGER)).toBe(true);
  });

  it('should reject invalid roles', () => {
    expect(EmployeeModel.isRole('ROOT')).toBe(false);
    expect(EmployeeModel.isRole(123)).toBe(false);
    expect(EmployeeModel.isRole(null)).toBe(false);
  });

  it('should create a valid employee dto', () => {
    const dto: EmployeeModel.CreateEmployeeDto = {
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      role: EmployeeModel.Role.EMPLOYEE,
      passwordConfirmation: '123456',
    };
    expect(dto).toBeDefined();
    expect(dto.name).toBe('John Doe');
    expect(dto.email).toBe('john@example.com');
    expect(dto.password).toBe('123456');
    expect(dto.role).toBe(EmployeeModel.Role.EMPLOYEE);
    expect(dto.passwordConfirmation).toBe('123456');
  });
});

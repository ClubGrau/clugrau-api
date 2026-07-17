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
});

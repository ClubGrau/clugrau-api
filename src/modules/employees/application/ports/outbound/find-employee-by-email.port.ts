import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
export interface FindEmployeeByEmailPort {
  findByEmail(email: string): Promise<EmployeeModel.toCreate | null>;
}

import { EmployeeModel } from '@modules/employees/domain/models/employee.model';

/** Input do caso de uso CreateEmployee (entrada da application). */
export interface CreateEmployeeDto {
  name: string;
  email: string;
  role: EmployeeModel.Role;
  nif?: number | null;
  password: string;
  passwordConfirmation: string;
}

/** Output do caso de uso CreateEmployee (saída da application). */
export interface CreateEmployeeResultDto {
  id: string;
}

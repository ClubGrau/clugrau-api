import { EmployeeModel } from '@modules/employees/domain/models/employee.model';

/** Input do caso de uso GetEmployees (filtros opcionais da query). */
export interface GetEmployeesDto {
  isActive?: boolean;
  role?: EmployeeModel.Role;
}

/**
 * Read model de um employee na listagem.
 * Não inclui password — distinto de EmployeeModel.toCreate.
 */
export interface GetEmployeesItemDto {
  id: string;
  name: string;
  email: string;
  role: EmployeeModel.Role;
  nif: string | null;
  isActive: boolean;
  createdAt: Date;
  deactivateAt: Date | null;
}

/** Output do caso de uso GetEmployees (saída da application). */
export interface GetEmployeesResultDto {
  employees: GetEmployeesItemDto[];
}

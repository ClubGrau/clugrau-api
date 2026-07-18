import { EmployeeModel } from '@modules/employees/domain/models/employee.model';

export interface CreateEmployeePort {
  execute(
    params: EmployeeModel.CreateEmployeeDto,
  ): Promise<EmployeeModel.CreateEmployeeResultDto>;
}

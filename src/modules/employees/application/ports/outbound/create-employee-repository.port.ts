import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { CreateEmployeeResultDto } from '../../dtos/create-employee.dto';

export interface CreateEmployeeRepositoryPort {
  create(employee: EmployeeModel.toCreate): Promise<CreateEmployeeResultDto>;
}

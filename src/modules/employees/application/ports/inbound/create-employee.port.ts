import {
  CreateEmployeeDto,
  CreateEmployeeResultDto,
} from '../../dtos/create-employee.dto';

export interface CreateEmployeePort {
  execute(params: CreateEmployeeDto): Promise<CreateEmployeeResultDto>;
}

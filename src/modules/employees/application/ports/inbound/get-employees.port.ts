import {
  GetEmployeesDto,
  GetEmployeesResultDto,
} from '../../dtos/get-employees.dto';

export interface GetEmployeesPort {
  execute(filters: GetEmployeesDto): Promise<GetEmployeesResultDto>;
}

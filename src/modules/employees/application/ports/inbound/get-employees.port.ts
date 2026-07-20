import {
  GetEmployeesDto,
  GetEmployeesItemDto,
} from '../../dtos/get-employees.dto';

export interface GetEmployeesPort {
  execute(filters: GetEmployeesDto): Promise<GetEmployeesItemDto[]>;
}

import {
  GetEmployeesDto,
  GetEmployeesItemDto,
} from '../../dtos/get-employees.dto';

export interface FindEmployeesPort {
  findAll(filters: GetEmployeesDto): Promise<GetEmployeesItemDto[]>;
}

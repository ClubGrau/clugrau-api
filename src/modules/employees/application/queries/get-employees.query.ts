import {
  GetEmployeesDto,
  GetEmployeesItemDto,
} from '../dtos/get-employees.dto';
import { GetEmployeesPort } from '../ports/inbound/get-employees.port';
import { FindEmployeesPort } from '../ports/outbound/find-employees.port';

export class GetEmployeesQuery implements GetEmployeesPort {
  constructor(private readonly findEmployees: FindEmployeesPort) {}

  async execute(filters: GetEmployeesDto): Promise<GetEmployeesItemDto[]> {
    return this.findEmployees.findAll(filters);
  }
}

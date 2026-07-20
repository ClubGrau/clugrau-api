import {
  normalizePagination,
  toPaginatedResult,
} from '@shared/application/pagination/pagination.dto';
import {
  GetEmployeesDto,
  GetEmployeesResultDto,
} from '../dtos/get-employees.dto';
import { GetEmployeesPort } from '../ports/inbound/get-employees.port';
import { FindEmployeesPort } from '../ports/outbound/find-employees.port';

export class GetEmployeesQuery implements GetEmployeesPort {
  constructor(private readonly findEmployees: FindEmployeesPort) {}

  async execute(filters: GetEmployeesDto): Promise<GetEmployeesResultDto> {
    const pagination = normalizePagination(filters);
    const { items, total } = await this.findEmployees.findAll({
      isActive: filters.isActive,
      role: filters.role,
      skip: pagination.skip,
      limit: pagination.limit,
    });

    const page = toPaginatedResult(items, total, pagination);

    return {
      employees: page.items,
      page: page.page,
      limit: page.limit,
      total: page.total,
      totalPages: page.totalPages,
    };
  }
}

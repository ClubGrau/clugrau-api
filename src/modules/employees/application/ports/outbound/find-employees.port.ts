import {
  FindEmployeesParams,
  FindEmployeesResult,
} from '../../dtos/get-employees.dto';

/** Driven port: leitura paginada de employees (lado query). */
export interface FindEmployeesPort {
  findAll(params: FindEmployeesParams): Promise<FindEmployeesResult>;
}

import { CreateEmployeeResultDto } from '@modules/employees/application/dtos/create-employee.dto';
import {
  FindEmployeesParams,
  FindEmployeesResult,
} from '@modules/employees/application/dtos/get-employees.dto';
import { CreateEmployeeRepositoryPort } from '@modules/employees/application/ports/outbound/create-employee-repository.port';
import { FindEmployeesPort } from '@modules/employees/application/ports/outbound/find-employees.port';
import { FindEmployeeByEmailPort } from '@modules/employees/domain/ports/find-employee-by-email.port';
import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { EmployeeDocument, EmployeeMongooseModel } from './employee.schema';
import {
  mapEmployeeDocument,
  mapEmployeeReadModel,
  mapToCreateDocument,
} from './employee.mapper';

export class EmployeeMongooseRepository
  implements
    FindEmployeeByEmailPort,
    CreateEmployeeRepositoryPort,
    FindEmployeesPort
{
  constructor(private readonly employeeModel: EmployeeMongooseModel) {}

  async create(
    employee: EmployeeModel.toCreate,
  ): Promise<CreateEmployeeResultDto> {
    const createdEmployee = await this.employeeModel.create(
      mapToCreateDocument(employee),
    );

    return { id: String(createdEmployee._id) };
  }

  async findByEmail(email: string): Promise<EmployeeModel.toCreate | null> {
    const employee = await this.employeeModel.findOne({ email }).lean();
    if (!employee) return null;

    return mapEmployeeDocument(employee as EmployeeDocument);
  }

  async findAll(params: FindEmployeesParams): Promise<FindEmployeesResult> {
    const filter: {
      isActive?: boolean;
      role?: EmployeeModel.Role;
    } = {};

    if (params.isActive !== undefined) {
      filter.isActive = params.isActive;
    }
    if (params.role !== undefined) {
      filter.role = params.role;
    }

    const [documents, total] = await Promise.all([
      this.employeeModel
        .find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(params.skip)
        .limit(params.limit)
        .lean(),
      this.employeeModel.countDocuments(filter),
    ]);

    return {
      items: (documents as EmployeeDocument[]).map(mapEmployeeReadModel),
      total,
    };
  }
}

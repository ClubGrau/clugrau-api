import { Model } from 'mongoose';
import { EmployeeDocument } from './employee.schema';
import { mapEmployeeDocument } from './employee.mapper';
import { EmployeeModel } from '../../../domain/models/employee.model';
import { FindEmployeeByEmailPort } from '../../../application/ports/outbound/find-employee-by-email.port';

export class EmployeeMongooseRepository implements FindEmployeeByEmailPort {
  constructor(private readonly employeeModel: Model<EmployeeDocument>) {}

  async findByEmail(email: string): Promise<EmployeeModel.toCreate | null> {
    const employee = await this.employeeModel.findOne({ email }).lean();
    if (!employee) return null;

    return mapEmployeeDocument(employee as EmployeeDocument);
  }
}

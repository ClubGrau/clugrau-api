import { EmployeeModel } from '@modules/employees/domain/models/employee.model';
import { EmployeeDocument } from './employee.schema';

/** Maps a lean Mongoose document to the application persistence DTO. */
export function mapEmployeeDocument(
  document: EmployeeDocument,
): EmployeeModel.toCreate {
  return {
    id: String(document._id),
    name: document.name,
    email: document.email,
    password: document.password,
    role: document.role as EmployeeModel.Role,
    nif: document.nif ? String(document.nif) : null,
    isActive: document.isActive ?? true,
    createdAt: document.createdAt ?? new Date(0),
    deactivateAt: document.deactivateAt ?? null,
  };
}

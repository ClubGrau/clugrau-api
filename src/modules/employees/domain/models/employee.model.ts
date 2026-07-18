import { Employee } from '../entities/Employee';

/**
 * Conceitos de domínio do Employee.
 * DTOs de entrada/saída de casos de uso ficam em application/dtos.
 */
export namespace EmployeeModel {
  export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
  }

  /** Snapshot serializado da entidade (persistência / ports de saída). */
  export type toCreate = ReturnType<Employee['toJSON']>;

  export const ROLES: readonly Role[] = Object.freeze(Object.values(Role));

  export function isRole(value: unknown): value is Role {
    return typeof value === 'string' && (ROLES as string[]).includes(value);
  }
}

export namespace EmployeeModel {
  export enum Role {
    ADMIN = 'ADMIN',
    MANAGER = 'MANAGER',
    EMPLOYEE = 'EMPLOYEE',
  }

  export const ROLES: readonly Role[] = Object.freeze(Object.values(Role));

  export interface CreateEmployeeDto {
    name: string;
    email: string;
    role: Role;
    nif?: number | null;
    password: string;
    passwordConfirmation: string;
  }

  export function isRole(value: unknown): value is Role {
    return typeof value === 'string' && (ROLES as string[]).includes(value);
  }
}

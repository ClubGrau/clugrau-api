/**
 * Snapshot genérico de um usuário autenticável.
 *
 * Independente de Employee/Customer — o adapter de infrastructure
 * preenche este tipo a partir da fonte atual (ex.: collection Employee).
 * Contém apenas o que o login e o token precisam.
 */
export type AuthenticatableUser = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isActive: boolean;
  /** Claim para o token; string para não acoplar a enums de outros módulos. */
  role: string;
};

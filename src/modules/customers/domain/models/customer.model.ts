import { Customer } from '../entities/Customer';

/**
 * Conceitos de domínio do Customer.
 * DTOs de entrada/saída de casos de uso ficam em application/dtos.
 */
export namespace CustomerModel {
  /** Snapshot serializado da entidade (persistência / ports de saída). */
  export type toCreate = ReturnType<Customer['toJSON']>;
}

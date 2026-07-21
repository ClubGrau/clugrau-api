import { DomainError } from '@shared/domain/errors/domain.error';

export class CustomerAlreadyExistsError extends DomainError {
  constructor() {
    super('Customer already exists');
  }
}

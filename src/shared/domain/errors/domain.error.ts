/**
 * Base class for all domain-level errors.
 * Domain errors represent violations of business rules and must not depend
 * on any framework or infrastructure concern.
 */
export abstract class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

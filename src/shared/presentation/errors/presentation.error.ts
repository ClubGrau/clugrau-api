/**
 * Base class for all presentation-level errors.
 * Presentation errors represent violations of business rules and must not depend
 * on any framework or infrastructure concern.
 */
export abstract class PresentationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

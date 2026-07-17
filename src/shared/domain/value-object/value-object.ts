/**
 * Base class for Value Objects.
 *
 * A Value Object is immutable and has no identity: two value objects are equal
 * when their internal properties are equal (structural equality).
 */
export abstract class ValueObject<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    this.props = Object.freeze(props);
  }

  public equals(other?: ValueObject<T>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor !== this.constructor) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(other.props);
  }

  /**
   * Primitive representation of the value object, used when serializing the
   * owning entity to a plain object (see `Entity.toJSON`).
   */
  public abstract toJSON(): unknown;
}

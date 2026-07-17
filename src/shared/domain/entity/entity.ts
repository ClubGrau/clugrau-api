import { UniqueEntityId } from '../value-object/id/unique-entity-id.vo';
import { ValueObject } from '../value-object/value-object';

/** Converts a value-object property type into its serialized primitive type. */
type Serialized<T> =
  T extends ValueObject<unknown> ? ReturnType<T['toJSON']> : T;

/** Plain (framework-agnostic) representation of an entity. */
export type EntityJSON<Props> = { id: string } & {
  [K in keyof Props]: Serialized<Props[K]>;
};

/**
 * Base class for Entities.
 *
 * An Entity has a stable identity (`UniqueEntityId`): two entities are equal
 * when they share the same identity, regardless of their attributes.
 * Entity data is exposed as a plain object through `toJSON()`, with every
 * value object serialized to its primitive representation.
 */
export abstract class Entity<Props extends object> {
  public readonly _id: UniqueEntityId;
  public readonly props: Props;

  protected constructor(props: Props, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  get id(): string {
    return this._id.value;
  }

  public equals(other?: Entity<Props>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other === this) {
      return true;
    }
    if (other.constructor !== this.constructor) {
      return false;
    }
    return this._id.value === other._id.value;
  }

  public toJSON(): EntityJSON<Props> {
    const plain: Record<string, unknown> = { id: this.id };

    for (const [key, value] of Object.entries(this.props)) {
      plain[key] = value instanceof ValueObject ? value.toJSON() : value;
    }

    return plain as EntityJSON<Props>;
  }
}

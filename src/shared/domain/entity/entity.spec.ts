import { Entity } from './entity';
import { UniqueEntityId } from '../value-object/id/unique-entity-id.vo';
import { ValueObject } from '../value-object/value-object';

const HEX_24 = /^[0-9a-f]{24}$/;
const ID_A = '507f1f77bcf86cd799439011';
const ID_B = 'aaaaaaaaaaaaaaaaaaaaaaaa';

class LabelVO extends ValueObject<{ value: string }> {
  constructor(value: string) {
    super({ value });
  }

  toJSON(): string {
    return this.props.value;
  }
}

interface ThingProps {
  label: LabelVO;
  count: number;
  createdAt: Date;
}

class Thing extends Entity<ThingProps> {
  constructor(props: ThingProps, id?: UniqueEntityId) {
    super(props, id);
  }
}

// A different entity type sharing the same props shape.
class OtherThing extends Entity<ThingProps> {
  constructor(props: ThingProps, id?: UniqueEntityId) {
    super(props, id);
  }
}

const makeProps = (): ThingProps => ({
  label: new LabelVO('hello'),
  count: 42,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
});

describe('Entity (base)', () => {
  describe('identity', () => {
    it('should generate a 24-char hex id when none is provided', () => {
      const thing = new Thing(makeProps());
      expect(thing.id).toMatch(HEX_24);
    });

    it('should generate unique ids for different instances', () => {
      expect(new Thing(makeProps()).id).not.toBe(new Thing(makeProps()).id);
    });

    it('should use the provided id', () => {
      const thing = new Thing(makeProps(), new UniqueEntityId(ID_A));
      expect(thing.id).toBe(ID_A);
    });
  });

  describe('equals', () => {
    it('should be true for entities with the same id', () => {
      const a = new Thing(makeProps(), new UniqueEntityId(ID_A));
      const b = new Thing(makeProps(), new UniqueEntityId(ID_A));
      expect(a.equals(b)).toBe(true);
    });

    it('should be true when comparing with itself', () => {
      const a = new Thing(makeProps(), new UniqueEntityId(ID_A));
      expect(a.equals(a)).toBe(true);
    });

    it('should be false for entities with different ids', () => {
      const a = new Thing(makeProps(), new UniqueEntityId(ID_A));
      const b = new Thing(makeProps(), new UniqueEntityId(ID_B));
      expect(a.equals(b)).toBe(false);
    });

    it.each([null, undefined])(
      'should be false when compared to %p',
      (other) => {
        const a = new Thing(makeProps(), new UniqueEntityId(ID_A));
        expect(a.equals(other as unknown as Thing)).toBe(false);
      },
    );

    it('should be false for different entity types with the same id', () => {
      const a = new Thing(makeProps(), new UniqueEntityId(ID_A));
      const b = new OtherThing(makeProps(), new UniqueEntityId(ID_A));
      expect(a.equals(b as unknown as Thing)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return a plain object with the id', () => {
      const thing = new Thing(makeProps(), new UniqueEntityId(ID_A));
      expect(thing.toJSON().id).toBe(ID_A);
    });

    it('should serialize value-object props to their primitive form', () => {
      const thing = new Thing(makeProps());
      expect(thing.toJSON().label).toBe('hello');
      expect(typeof thing.toJSON().label).toBe('string');
    });

    it('should pass through non value-object props unchanged', () => {
      const props = makeProps();
      const thing = new Thing(props);
      const json = thing.toJSON();

      expect(json.count).toBe(42);
      expect(json.createdAt).toBe(props.createdAt);
      expect(json.createdAt).toBeInstanceOf(Date);
    });
  });
});

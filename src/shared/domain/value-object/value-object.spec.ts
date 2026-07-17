import { ValueObject } from './value-object';

interface StrProps {
  value: string;
}

class StringVO extends ValueObject<StrProps> {
  constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  toJSON(): string {
    return this.props.value;
  }

  isFrozen(): boolean {
    return Object.isFrozen(this.props);
  }
}

// A different VO type wrapping the same shape, to test type-aware equality.
class OtherVO extends ValueObject<StrProps> {
  constructor(value: string) {
    super({ value });
  }

  toJSON(): string {
    return this.props.value;
  }
}

describe('ValueObject (base)', () => {
  describe('immutability', () => {
    it('should freeze its props on construction', () => {
      expect(new StringVO('a').isFrozen()).toBe(true);
    });
  });

  describe('equals', () => {
    it('should be true for two value objects with the same props', () => {
      expect(new StringVO('abc').equals(new StringVO('abc'))).toBe(true);
    });

    it('should be false for value objects with different props', () => {
      expect(new StringVO('abc').equals(new StringVO('xyz'))).toBe(false);
    });

    it('should be true when comparing with itself', () => {
      const vo = new StringVO('abc');
      expect(vo.equals(vo)).toBe(true);
    });

    it.each([null, undefined])(
      'should be false when compared to %p',
      (other) => {
        expect(new StringVO('abc').equals(other as unknown as StringVO)).toBe(
          false,
        );
      },
    );

    it('should be false for different value-object types with the same props', () => {
      const a = new StringVO('abc');
      const b = new OtherVO('abc');
      expect(a.equals(b as unknown as StringVO)).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should return the primitive representation defined by the subclass', () => {
      expect(new StringVO('abc').toJSON()).toBe('abc');
    });
  });
});

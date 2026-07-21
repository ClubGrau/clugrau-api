import { InvalidPhoneFormatError, Phone } from './phone.vo';

describe('Phone (value object)', () => {
  it.each([
    ['+351 912 345 678', '351912345678'],
    ['+33 6 12 34 56 78', '33612345678'],
    ['912345678', '912345678'],
    ['(351) 912-345-678', '351912345678'],
  ])('should create a valid phone from %p', (input, expected) => {
    const phone = Phone.create(input);
    expect(phone.value).toBe(expected);
  });

  it('should store digits-only normalized value', () => {
    const phone = Phone.create('+351 912 345 678');
    expect(phone.toJSON()).toBe('351912345678');
    expect(phone.toString()).toBe('351912345678');
  });

  it.each([null, undefined])('should throw when value is %p', (value) => {
    expect(() => Phone.create(value as unknown as string)).toThrow(
      InvalidPhoneFormatError,
    );
  });

  it.each(['', '   ', '\t\n'])(
    'should throw for empty / whitespace-only %p',
    (value) => {
      expect(() => Phone.create(value)).toThrow(InvalidPhoneFormatError);
    },
  );

  it('should throw when digit count is below the minimum', () => {
    expect(() => Phone.create('123')).toThrow(InvalidPhoneFormatError);
  });

  it('should throw when digit count is above the maximum', () => {
    expect(() => Phone.create('1234567890123456')).toThrow(
      InvalidPhoneFormatError,
    );
  });

  it('should accept boundary digit counts of 7 and 15', () => {
    expect(Phone.create('1234567').value).toBe('1234567');
    expect(Phone.create('123456789012345').value).toBe('123456789012345');
  });

  it('should consider two phones with the same digits equal', () => {
    expect(
      Phone.create('+351 912 345 678').equals(Phone.create('351912345678')),
    ).toBe(true);
  });
});

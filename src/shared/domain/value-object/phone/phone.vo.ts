import { ValueObject } from '../value-object';
import { DomainError } from '@shared/domain/errors/domain.error';

export class InvalidPhoneFormatError extends DomainError {}

interface PhoneProps {
  value: string;
}

/**
 * International phone number value object.
 *
 * Accepts multi-country European numbers (country picker lives on the frontend).
 * Validates digit length after stripping non-digits (E.164 practical bounds: 7–15).
 * Stores the normalized digits-only form.
 */
export class Phone extends ValueObject<PhoneProps> {
  static readonly MIN_DIGITS = 7;
  static readonly MAX_DIGITS = 15;

  private constructor(props: PhoneProps) {
    super(props);
  }

  static create(value: string): Phone {
    if (value === null || value === undefined) {
      throw new InvalidPhoneFormatError('Phone is required');
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new InvalidPhoneFormatError('Invalid phone format: empty');
    }

    const digits = trimmed.replace(/\D/g, '');

    if (digits.length < Phone.MIN_DIGITS || digits.length > Phone.MAX_DIGITS) {
      throw new InvalidPhoneFormatError(
        `Invalid phone format: digit count must be between ${Phone.MIN_DIGITS} and ${Phone.MAX_DIGITS} (got ${digits.length})`,
      );
    }

    return new Phone({ value: digits });
  }

  get value(): string {
    return this.props.value;
  }

  toJSON(): string {
    return this.props.value;
  }

  override toString(): string {
    return this.props.value;
  }
}

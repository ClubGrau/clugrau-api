import { Entity } from '@shared/domain/entity/entity';
import { UniqueEntityId } from '@shared/domain/value-object/id/unique-entity-id.vo';
import { Email, Name, Nif, Phone } from '@shared/domain/value-object';

interface CustomerProps {
  name: Name;
  email: Email;
  phone: Phone | null;
  nif: Nif | null;
  createdAt: Date;
}

/** Input required to create a brand new customer. */
export interface CreateCustomerProps {
  name: string;
  email: string;
  phone?: string | null;
  nif?: number | null;
}

/** Full snapshot used to rebuild a customer from persistence. */
export interface ReconstituteCustomerProps {
  id: string;
  name: Name;
  email: Email;
  phone: Phone | null;
  nif: Nif | null;
  createdAt: Date;
}

export class Customer extends Entity<CustomerProps> {
  private constructor(props: CustomerProps, id?: UniqueEntityId) {
    super(props, id);
  }

  static create(input: CreateCustomerProps): Customer {
    return new Customer({
      name: Name.create(input.name),
      email: Email.create(input.email),
      phone: input.phone ? Phone.create(input.phone) : null,
      nif: input.nif ? Nif.create(input.nif.toString()) : null,
      createdAt: new Date(),
    });
  }

  static reconstitute(input: ReconstituteCustomerProps): Customer {
    return new Customer(
      {
        name: input.name,
        email: input.email,
        phone: input.phone,
        nif: input.nif,
        createdAt: input.createdAt,
      },
      new UniqueEntityId(input.id),
    );
  }

  changeName(name: Name): void {
    this.props.name = name;
  }

  changeEmail(email: Email): void {
    this.props.email = email;
  }

  assignPhone(phone: Phone | null): void {
    this.props.phone = phone;
  }

  assignNif(nif: Nif | null): void {
    this.props.nif = nif;
  }
}

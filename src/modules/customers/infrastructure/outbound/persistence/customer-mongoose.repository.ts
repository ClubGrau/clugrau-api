import { CreateCustomerResultDto } from '@modules/customers/application/dtos/create-customer.dto';
import { CreateCustomerRepositoryPort } from '@modules/customers/application/ports/outbound/create-customer-repository.port';
import { FindCustomerByEmailPort } from '@modules/customers/domain/ports/find-customer-by-email.port';
import { CustomerModel } from '@modules/customers/domain/models/customer.model';
import { CustomerDocument, CustomerMongooseModel } from './customer.schema';
import { mapCustomerDocument, mapToCreateDocument } from './customer.mapper';

export class CustomerMongooseRepository
  implements FindCustomerByEmailPort, CreateCustomerRepositoryPort
{
  constructor(private readonly customerModel: CustomerMongooseModel) {}

  async create(
    customer: CustomerModel.toCreate,
  ): Promise<CreateCustomerResultDto> {
    const createdCustomer = await this.customerModel.create(
      mapToCreateDocument(customer),
    );

    return { id: String(createdCustomer._id) };
  }

  async findByEmail(email: string): Promise<CustomerModel.toCreate | null> {
    const customer = await this.customerModel.findOne({ email }).lean();
    if (!customer) return null;

    return mapCustomerDocument(customer as CustomerDocument);
  }
}

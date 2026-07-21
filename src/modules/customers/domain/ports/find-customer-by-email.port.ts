import { CustomerModel } from '../models/customer.model';

export interface FindCustomerByEmailPort {
  findByEmail(email: string): Promise<CustomerModel.toCreate | null>;
}

import { FindCustomerByEmailPort } from '../ports/find-customer-by-email.port';
import { CustomerAlreadyExistsError } from '../errors/customer.errors';

export class CustomerPoliciesService {
  constructor(private readonly findCustomerByEmail: FindCustomerByEmailPort) {}

  /**
   * Ensures an email is free to be used when creating a new customer.
   *
   * - not found -> resolves (the email is available)
   * - found     -> throws CustomerAlreadyExistsError
   */
  async ensureEmailIsAvailable(email: string): Promise<void> {
    const existing = await this.findCustomerByEmail.findByEmail(email);

    if (!existing) {
      return;
    }

    throw new CustomerAlreadyExistsError();
  }
}

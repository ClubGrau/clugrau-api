import { FindCustomerByEmailPort } from '../ports/find-customer-by-email.port';
import { CustomerPoliciesService } from './customer-policies.service';
import { CustomerAlreadyExistsError } from '../errors/customer.errors';
import { Customer } from '../entities/Customer';
import { CustomerModel } from '../models/customer.model';

const makeStubs = () => ({
  findCustomerByEmailStub: {
    findByEmail: jest.fn().mockResolvedValue(null),
  } satisfies FindCustomerByEmailPort,
});

const makeSut = (): SutTypes => {
  const { findCustomerByEmailStub } = makeStubs();
  const sut = new CustomerPoliciesService(findCustomerByEmailStub);
  return { sut, findCustomerByEmailStub };
};

const makeCustomerSnapshot = (
  overrides: Partial<CustomerModel.toCreate> = {},
): CustomerModel.toCreate => ({
  ...Customer.create({
    name: 'John Doe',
    email: 'john.doe@example.com',
  }).toJSON(),
  ...overrides,
});

type SutTypes = {
  sut: CustomerPoliciesService;
  findCustomerByEmailStub: FindCustomerByEmailPort;
};

describe('CustomerPoliciesService', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CustomerPoliciesService);
  });

  it('should call findCustomerByEmail with correct email', async () => {
    const { sut, findCustomerByEmailStub } = makeSut();
    const email = 'test@example.com';
    const findByEmailSpy = jest.spyOn(findCustomerByEmailStub, 'findByEmail');

    await sut.ensureEmailIsAvailable(email);

    expect(findByEmailSpy).toHaveBeenCalledWith(email);
  });

  it('should resolve when no customer exists with the email', async () => {
    const { sut, findCustomerByEmailStub } = makeSut();
    jest
      .spyOn(findCustomerByEmailStub, 'findByEmail')
      .mockResolvedValueOnce(null);

    await expect(
      sut.ensureEmailIsAvailable('john.doe@example.com'),
    ).resolves.toBeUndefined();
  });

  it('should throw CustomerAlreadyExistsError when a customer exists', async () => {
    const { sut, findCustomerByEmailStub } = makeSut();
    jest
      .spyOn(findCustomerByEmailStub, 'findByEmail')
      .mockResolvedValueOnce(makeCustomerSnapshot());

    const result = sut.ensureEmailIsAvailable('john.doe@example.com');

    await expect(result).rejects.toBeInstanceOf(CustomerAlreadyExistsError);
    await expect(result).rejects.toThrow('Customer already exists');
  });
});

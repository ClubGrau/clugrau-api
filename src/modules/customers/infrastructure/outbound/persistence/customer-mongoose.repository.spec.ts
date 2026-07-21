import { CustomerModel } from '@modules/customers/domain/models/customer.model';
import { makeChainableMock } from '../../../../../configs/database/mongoose/testables';
import { CustomerMongooseRepository } from './customer-mongoose.repository';
import { CustomerDocument, CustomerMongooseModel } from './customer.schema';
import mongoose from 'mongoose';

const mockCustomer = {
  _id: new mongoose.Types.ObjectId(),
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '351912345678',
  nif: 123456789,
  createdAt: new Date('2024-01-01T00:00:00Z'),
} as CustomerDocument;

const mongooseMocks = () => makeChainableMock(mockCustomer);

const makeSut = () => {
  const customerModelMock = mongooseMocks();
  const mongooseDeps = customerModelMock as unknown as CustomerMongooseModel;
  const sut = new CustomerMongooseRepository(mongooseDeps);
  return { sut, customerModelMock };
};

describe('CustomerMongooseRepository', () => {
  it('should be defined', () => {
    const { sut } = makeSut();
    expect(sut).toBeDefined();
    expect(sut).toBeInstanceOf(CustomerMongooseRepository);
  });

  describe('findByEmail', () => {
    it('should findOne customer by email with a valid Mongoose query', async () => {
      const { sut, customerModelMock } = makeSut();

      const customerId = new mongoose.Types.ObjectId().toHexString();
      const email = 'john.doe@example.com';

      const findOneSpy = jest
        .spyOn(customerModelMock, 'findOne')
        .mockReturnValueOnce({
          lean: jest.fn().mockResolvedValueOnce({
            _id: customerId,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '351912345678',
            nif: 123456789,
            createdAt: new Date('2024-01-01T00:00:00Z'),
          }),
        });

      const result = await sut.findByEmail(email);
      expect(findOneSpy).toHaveBeenCalledWith({ email });
      expect(result).toEqual({
        id: customerId,
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '351912345678',
        nif: '123456789',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
    });

    it('should return null if no customer is found', async () => {
      const { sut, customerModelMock } = makeSut();

      const email = 'nonexistent@example.com';

      jest.spyOn(customerModelMock, 'findOne').mockReturnValueOnce({
        lean: jest.fn().mockResolvedValueOnce(null),
      });

      const result = await sut.findByEmail(email);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new customer with a valid Mongoose query', async () => {
      const { sut, customerModelMock } = makeSut();
      const customerData: CustomerModel.toCreate = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '33612345678',
        nif: '987654321',
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };
      const createSpy = jest
        .spyOn(customerModelMock, 'create')
        .mockResolvedValueOnce({
          _id: customerData.id,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '33612345678',
          nif: 987654321,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        });
      const result = await sut.create(customerData);
      expect(createSpy).toHaveBeenCalledWith({
        _id: new mongoose.Types.ObjectId(customerData.id),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: '33612345678',
        nif: 987654321,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
      expect(result).toEqual({ id: customerData.id });
    });

    it('should create a customer without optional phone and nif', async () => {
      const { sut, customerModelMock } = makeSut();
      const customerData: CustomerModel.toCreate = {
        id: new mongoose.Types.ObjectId().toHexString(),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: null,
        nif: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      };
      const createSpy = jest
        .spyOn(customerModelMock, 'create')
        .mockResolvedValueOnce({
          _id: customerData.id,
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: null,
          nif: null,
          createdAt: new Date('2024-01-01T00:00:00Z'),
        });
      const result = await sut.create(customerData);
      expect(createSpy).toHaveBeenCalledWith({
        _id: new mongoose.Types.ObjectId(customerData.id),
        name: 'Jane Doe',
        email: 'jane.doe@example.com',
        phone: null,
        nif: null,
        createdAt: new Date('2024-01-01T00:00:00Z'),
      });
      expect(result).toEqual({ id: customerData.id });
    });
  });
});

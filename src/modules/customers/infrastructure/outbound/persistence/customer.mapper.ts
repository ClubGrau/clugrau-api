import mongoose from 'mongoose';
import { CustomerModel } from '@modules/customers/domain/models/customer.model';
import { CustomerDocument } from './customer.schema';

/** Maps a lean Mongoose document to the application persistence DTO. */
export function mapCustomerDocument(
  document: CustomerDocument,
): CustomerModel.toCreate {
  return {
    id: String(document._id),
    name: document.name,
    email: document.email,
    phone: document.phone ?? null,
    nif: document.nif != null ? String(document.nif) : null,
    createdAt: document.createdAt ?? new Date(0),
  };
}

/** Maps the application DTO to the Mongoose persistence payload. */
export function mapToCreateDocument(
  customer: CustomerModel.toCreate,
): CustomerDocument {
  const { id, nif, ...rest } = customer;

  return {
    ...rest,
    _id: new mongoose.Types.ObjectId(id),
    nif: nif ? Number(nif) : null,
  };
}

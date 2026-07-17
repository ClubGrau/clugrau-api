import mongoose, { InferSchemaType } from 'mongoose';

export const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: {
    type: String,
    enum: ['ADMIN', 'MANAGER', 'EMPLOYEE'],
    required: true,
  },
  password: { type: String, required: true },
  nif: { type: Number },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  deactivateAt: { type: Date, default: null },
});

EmployeeSchema.index({ email: 1 }, { unique: true });

export type EmployeeDocument = InferSchemaType<typeof EmployeeSchema> & {
  _id: mongoose.Types.ObjectId;
};

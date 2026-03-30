import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IVerificationToken extends Document {
  identifier: string; // email yoki phone
  token: string;
  expires: Date;
}

const VerificationTokenSchema = new Schema<IVerificationToken>(
  {
    identifier: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expires: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index'lar
VerificationTokenSchema.index({ token: 1 });
VerificationTokenSchema.index({ identifier: 1, token: 1 }, { unique: true });
VerificationTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 }); // TTL index

const VerificationToken: Model<IVerificationToken> =
  mongoose.models.VerificationToken ||
  mongoose.model<IVerificationToken>(
    'VerificationToken',
    VerificationTokenSchema
  );

export default VerificationToken;

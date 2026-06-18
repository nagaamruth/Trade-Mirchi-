import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "superadmin" | "admin" | "manager" | "sales" | "warehouse" | "customer";
  phone?: string;
  photo?: string;
  addresses?: { label: string; street: string; city: string; state: string; zipCode: string; country: string; }[];
  kycStatus: "unverified" | "pending" | "approved" | "rejected";
  kycDocuments: { type: string; number: string; url: string; }[];
  isEmailVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for OAuth
    role: {
      type: String,
      enum: ["superadmin", "admin", "manager", "sales", "warehouse", "customer"],
      default: "customer",
    },
    phone: { type: String },
    photo: { type: String },
    addresses: [{
      label: { type: String },
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      country: { type: String, default: "India" }
    }],
    kycStatus: {
      type: String,
      enum: ["unverified", "pending", "approved", "rejected"],
      default: "unverified"
    },
    kycDocuments: [{
      type: { type: String, enum: ["Business License", "GST", "Aadhar", "PAN"] },
      number: String,
      url: String
    }],
    isEmailVerified: { type: Boolean, default: false },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

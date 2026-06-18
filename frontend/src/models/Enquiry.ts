import mongoose, { Schema, Document } from "mongoose";

export interface IEnquiry extends Document {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  productsInterested: {
    product: mongoose.Types.ObjectId | any;
    name: string;
    quantity: number;
    unit: string;
  }[];
  status: "new" | "contacted" | "negotiating" | "converted" | "closed";
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema: Schema = new Schema(
  {
    companyName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    productsInterested: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["new", "contacted", "negotiating", "converted", "closed"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

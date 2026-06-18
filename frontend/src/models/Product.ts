import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  variety: string;
  category: string;
  description: string;
  images: string[];
  stock: number;
  availableStockType: "godown" | "ac_storage";
  moq: number; // Minimum Order Quantity in KG
  origin: string;
  grade: string;
  heatLevel: string; // e.g., "75000-100000 SHU"
  colorValue: string; // e.g., "30-40 ASTA"
  moisturePercentage: number;
  stemPercentage: number;
  packingSizes: string[]; // e.g., ["25kg Bag", "50kg Bag"]
  currentPrice: number; // Price per KG
  status: "active" | "draft" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    variety: { type: String, required: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0 },
    availableStockType: { type: String, enum: ["godown", "ac_storage"], default: "godown" },
    moq: { type: Number, required: true, default: 100 },
    origin: { type: String, required: true },
    grade: { type: String, required: true },
    heatLevel: { type: String },
    colorValue: { type: String },
    moisturePercentage: { type: Number },
    stemPercentage: { type: Number },
    packingSizes: [{ type: String }],
    currentPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "draft", "archived"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

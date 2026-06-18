import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  allowRetailUnits: boolean;
  siteName: string;
  currency: string;
  maintenanceMode: boolean;
  require2FA: boolean;
}

const SettingsSchema: Schema = new Schema(
  {
    allowRetailUnits: { type: Boolean, default: true },
    siteName: { type: String, default: "Trade Mirchi" },
    currency: { type: String, default: "INR" },
    maintenanceMode: { type: Boolean, default: false },
    require2FA: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

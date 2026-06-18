import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
  allowRetailUnits: boolean;
  siteName: string;
  currency: string;
  maintenanceMode: boolean;
  require2FA: boolean;
  liveRates: { commodity: string; price: string }[];
  contactDetails: {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    workingHours: string;
  };
}

const SettingsSchema: Schema = new Schema(
  {
    allowRetailUnits: { type: Boolean, default: true },
    siteName: { type: String, default: "Trade Mirchi" },
    currency: { type: String, default: "INR" },
    maintenanceMode: { type: Boolean, default: false },
    require2FA: { type: Boolean, default: false },
    liveRates: { 
      type: [{ commodity: String, price: String }], 
      default: [
        { commodity: "Premium Teja", price: "₹22,500/q" },
        { commodity: "Guntur Sannam", price: "₹18,200/q" },
        { commodity: "Turmeric Finger", price: "₹14,500/q" }
      ]
    },
    contactDetails: {
      type: Object,
      default: {
        email: "contact@trademirchi.com",
        phone: "+91 9059815694",
        whatsapp: "+91 9059815694",
        address: "Malakpet Mirchi Market, Hyderabad, Telangana, India",
        workingHours: "Mon-Sat: 9AM - 6PM"
      }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

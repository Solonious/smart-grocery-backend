import mongoose, { Schema, Document } from "mongoose";

// Інтерфейс продукту
export interface IProduct extends Document {
  name: string;
  price: number;
  image: string;
  store: string; // Novus, ATB, Silpo
  lastUpdated: Date;
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  image: { type: String },
  store: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

export default mongoose.model<IProduct>("Product", ProductSchema);
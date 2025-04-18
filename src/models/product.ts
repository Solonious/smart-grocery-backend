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
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  store: { type: String, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

ProductSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.model<IProduct>("Product", ProductSchema);
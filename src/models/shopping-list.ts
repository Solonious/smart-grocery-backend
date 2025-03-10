import mongoose, { Schema, Document } from "mongoose";
import user from "./user";

interface IItem {
  name: string;
  quantity: number;
  price?: number;
}

export interface IShoppingList extends Document {
  name: string;
  items: IItem[];
  user: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const ShoppingListSchema: Schema = new Schema({
  name: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number },
    },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
export default mongoose.model<IShoppingList>("ShoppingList", ShoppingListSchema);
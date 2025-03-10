import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error(":x: MONGO_URI не знайдено у файлі .env");
    }
    console.log(":link: Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    console.log(`:white_check_mark: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(":x: MongoDB Connection Error:", error);
    process.exit(1);
  }
};

export default connectDB;
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const {
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_HOST,
  MONGO_PORT,
  MONGO_DB
} = process.env;

const uri = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;

const connectDB = async () => {
  try {
    if (!uri) {
      throw new Error(":x: MONGO_URI не знайдено у файлі .env");
    }
    console.log(":link: Connecting to MongoDB...");
    const conn = await mongoose.connect(uri, {
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
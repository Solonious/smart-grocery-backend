import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import ShoppingListRoutes from "./routes/shopping-list.routes";
import AuthRoutes from "./routes/auth.routes";
import OcrRoutes from "./routes/ocr.routes";
import ProductRoutes from "./routes/product.routes";
import { updateProductPrices } from "./services/product-upater";

dotenv.config();

// Створюємо екземпляр додатку Express
const app: Application = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", AuthRoutes);

app.use("/api/shopping-list", ShoppingListRoutes);

app.use("/api/ocr", OcrRoutes);

app.use("/api/products", ProductRoutes);


const PORT = process.env.PORT || 5006;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/smart_grocery";

const startServer = async () => {
    try {
        await connectDB();
        
        app.get("/", (req: Request, res: Response) => {
            res.send("Smart Grocery List API is running");
        });

        app.listen(PORT, async () => {
            console.log(`:rocket: Server running on port ${PORT}`);

            await updateProductPrices();
        });
    } catch (error) {
        console.error(":x: Server Error", error);
        process.exit(1);
    }
};

startServer();
// Запустіть сервер, використовуючи npm run dev
// Перейдіть за посиланням http://localhost:5006/ у свій браузер, щоб перевірити, чи працює сервер
// Якщо все працює, ви повинні побачити повідомлення "Smart Grocery List API is running" у вікні браузера
// Якщо ви бачите це повідомлення, це означає, що сервер працює успішно
// Якщо ви бачите повідомлення про помилку, переконайтеся, що ви виконали всі кроки правильно
// Якщо у вас виникли проблеми, перевірте свій код з уроку або зверніться до нас за допомогою чату
// Якщо у вас виникли проблеми, перевірте свій код з уроку або зверніться до нас за допомогою чату
// Якщо у вас виникли проблеми, перевірте свій код з уроку або зверніться до нас за допомогою чату

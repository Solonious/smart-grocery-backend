import { Request, Response } from "express";
import Product from "../models/product";
import { fetchNovusProductsWithPuppeteer } from "../services/puppeteer";

const CACHE_EXPIRATION_HOURS = 24; // :snowflake: Кеш оновлюється раз на 24 години

export const searchProducts = async (req: Request, res: Response) => {
  const query = req.query.query as string;

  if (!query) {
    return res.status(400).json({ message: "Вкажіть запит для пошуку" });
  }
  try {
    console.log(`:mag: Шукаємо товари в базі: ${query}`);

    // Шукаємо товари в кеші (останнє оновлення не більше 24 годин тому)
    const cachedProducts = await Product.find({
      name: new RegExp(query, "i"),
      lastUpdated: { $gt: new Date(Date.now() - CACHE_EXPIRATION_HOURS * 60 * 60 * 1000) },
    }).sort({ lastUpdated: -1 }).limit(10);

    if (cachedProducts.length > 0) {
      console.log(":white_check_mark: Знайдено товари у кеші");
      return res.json(cachedProducts);
    }

    console.log(":zap: Товари в кеші не знайдено, парсимо Novus...");

    const novusProducts = await fetchNovusProductsWithPuppeteer(query);

    if (novusProducts.length === 0) {
      return res.status(404).json({ message: "Товари не знайдено" });
    }

    // Зберігаємо товари у базу
    await Product.insertMany(
      novusProducts.map((p: any) => ({
        ...p,
        lastUpdated: new Date(),
      })),
      { ordered: false }
    ).catch((err) => console.error(":x: Помилка збереження в базу:", err));
    res.json(novusProducts);
  } catch (error) {
    console.error(":x: Помилка отримання товарів:", error);
    res.status(500).json({ message: "Помилка отримання товарів" });
  }
};
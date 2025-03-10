import { Request, Response } from "express";
import Tesseract from "tesseract.js";
import fs from "fs";
import path from "path";
import sharp from "sharp";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
  }

// :camera_with_flash: Обробка чеку
// :white_check_mark: Попередня обробка зображення перед OCR
const preprocessImage = async (filePath: string) => {
    const processedPath = path.join("uploads", `processed-${Date.now()}.png`);

    await sharp(filePath)
      .resize(1500) // Зменшуємо розмір зображення
      .grayscale() // Робимо зображення чорно-білим
      .sharpen() // Покращуємо контраст
      .threshold(150) // Видаляємо шуми
      .normalize() // Вирівнюємо кольори
      .toFile(processedPath);

    return processedPath;
  };
  
  export const processReceipt = async (req: MulterRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не завантажено" });
    }
    try {
      console.log(`:camera_with_flash: Обробка файлу: ${req.file.path}`);

      // Попередньо обробляємо зображення
      const processedPath = await preprocessImage(req.file.path);

      // Запускаємо OCR з українською мовою
      const { data } = await Tesseract.recognize(processedPath, "ukr+eng", {
        logger: (m) => console.log(m),
        langPath: path.join(__dirname, "../tessdata"),
      });

      console.log(":page_facing_up: Розпізнаний текст:", data.text);

      // Очищаємо текст перед парсингом
      const cleanedText = cleanOcrText(data.text);
      // Парсимо текст у список покупок
      const items = extractItemsFromText(cleanedText);

      // Видаляємо тимчасові файли
      fs.unlinkSync(req.file.path);
      fs.unlinkSync(processedPath);
      res.json({ items });
    } catch (error) {
      console.error(":x: Помилка розпізнавання:", error);
      res.status(500).json({ message: "Помилка розпізнавання тексту" });
    }
  };

  
  // :white_check_mark: Очищення тексту перед парсингом
  const cleanOcrText = (text: string) => {
    return text
      .replace(/[^\w\s\d.,-]/g, "") // Видаляємо зайві символи
      .replace(/\s{2,}/g, " ") // Замінюємо зайві пробіли
      .trim();
  };
  // :white_check_mark: Парсимо текст у список покупок

  const extractItemsFromText = (text: string) => {
    const lines = text.split("\n");
    const items = [];

    for (const line of lines) {
      const match = line.match(/([\wА-Яа-я]+)\s+(\d+(\.\d{1,2})?)/); // Парсимо "назва товару ціна"
      if (match) {
        items.push({ name: match[1].trim(), price: parseFloat(match[2]) });
      }
    }
    return items;
  };

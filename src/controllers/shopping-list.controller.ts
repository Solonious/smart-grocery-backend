import { Request, Response } from "express";
import ShoppingList from "../models/shopping-list";
import { AuthRequest } from "../middlewares/auth.middleware";

// :white_check_mark: Отримати списки *тільки для авторизованого користувача
export const getLists = async (req: AuthRequest, res: Response) => {
  try {
    const lists = await ShoppingList.find({ user: req.user._id }); // Фільтр за user ID
    res.json(lists);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// :white_check_mark: Створити список (тільки для авторизованого користувача)
export const createList = async (req: AuthRequest, res: Response) => {
  try {
    const { name, items } = req.body;
    if (!name || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Некоректні дані" });
    }
    const newList = new ShoppingList({ name, items, user: req.user._id }); // Прив’язка до user
    await newList.save();
    res.status(201).json(newList);
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// :white_check_mark: Оновити список
export const updateList = async (req: AuthRequest, res: Response) => {
    try {
      const { name, items } = req.body;
      const list = await ShoppingList.findById(req.params.id);

      if (!list) {
        return res.status(404).json({ message: "Список не знайдено" });
      }

      // :lock: Перевіряємо, чи цей список належить авторизованому користувачеві
      if (list.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Немає прав на редагування цього списку" });
      }

      // :small_blue_diamond: Оновлюємо дані списку
      if (name) list.name = name;
      if (items && Array.isArray(items)) list.items = items;

      const updatedList = await list.save();

      res.json(updatedList);
    } catch (error) {
      res.status(500).json({ message: "Помилка при оновленні списку" });
    }
};

// :white_check_mark: Видалити список (перевіряємо власника)
export const deleteList = async (req: AuthRequest, res: Response) => {
  try {
    const list = await ShoppingList.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "Список не знайдено" });
    }
    if (list.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Немає прав на видалення цього списку" });
    }
    await list.deleteOne();
    res.json({ message: "Список видалено" });
  } catch (error) {
    res.status(500).json({ message: "Помилка при видаленні" });
  }
};
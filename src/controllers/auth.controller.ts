import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user";

// Генерація токена
const generateToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

// :white_check_mark: Реєстрація користувача
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Заповніть всі поля" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Користувач вже існує" });
    }
    const user = new User({ name, email, password });
    await user.save();
    res.status(201).json({
      message: "Користувач створений",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};

// :white_check_mark: Логін користувача
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Невірний email або пароль" });
    }
    res.json({
      message: "Вхід успішний",
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: "Помилка сервера" });
  }
};
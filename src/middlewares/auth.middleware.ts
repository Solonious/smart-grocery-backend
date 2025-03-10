import { Request, Response, NextFunction, RequestHandler } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";


export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Немає доступу" });
  }
  try {
    token = token.split(" ")[1];
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = await User.findById(decoded.id).select("-password");
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Невірний токен" });
  }
};
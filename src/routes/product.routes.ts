import { RequestHandler, Router } from "express";
import { searchProducts } from "../controllers/product.controller";

const router = Router();

router.get("/search", searchProducts as RequestHandler);

export default router;
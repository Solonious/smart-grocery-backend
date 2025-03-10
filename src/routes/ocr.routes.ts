import { RequestHandler, Router } from "express";
import { processReceipt } from "../controllers/ocr.controller";
import upload from "../middlewares/upload.middleware";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.post("/scan", protect as RequestHandler, upload.single("image"), processReceipt as RequestHandler);

export default router;
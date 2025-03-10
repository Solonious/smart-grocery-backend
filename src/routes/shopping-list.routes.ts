import { RequestHandler, Router } from "express";
import { getLists, createList, deleteList, updateList } from "../controllers/shopping-list.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", protect as RequestHandler, getLists as RequestHandler);
router.post("/", protect as RequestHandler, createList as RequestHandler);
router.put("/:id", protect as RequestHandler, updateList as RequestHandler);
router.delete("/:id", protect as RequestHandler, deleteList as RequestHandler);

export default router;
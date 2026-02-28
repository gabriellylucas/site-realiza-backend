import { Router } from "express";
import { ProductController } from "../controllers/ProductController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, ProductController.create);
router.get("/", ProductController.list);

export default router;
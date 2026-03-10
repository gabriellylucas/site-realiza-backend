import { Router } from "express";
import { ProdutoController } from "../controllers/ProdutoController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", authMiddleware, ProdutoController.create);
router.get("/", ProdutoController.list);
router.put("/:id", ProdutoController.update);
router.delete("/:id", ProdutoController.delete);

export default router;
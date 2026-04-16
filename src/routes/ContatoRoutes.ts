import { Router } from "express";
import { ContatoController } from "../controllers/ContatoController";

const router = Router();

router.post("/", ContatoController.create);
router.get("/", ContatoController.list);
router.put("/:id", ContatoController.update);
router.delete("/:id", ContatoController.delete);

export default router;
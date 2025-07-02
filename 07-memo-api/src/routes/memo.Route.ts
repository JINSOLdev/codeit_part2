import { Router } from "express";
import { validateMemo } from "../middlewares/validator";
import { getMemos, createMemo } from "../controllers/memo.controller";

const router = Router();

router.get("/", getMemos);
router.post("/", validateMemo, createMemo);

export default router;

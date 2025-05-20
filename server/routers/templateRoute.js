import { Router } from "express";
import { createTemplate, getAllTemplates, getTemplate, updateTemplate, deleteTemplate } from "../controllers/templateController.js";
import authenticateJWT from "../middlewares/authenticate.js";

const router = Router();

router.post("/",authenticateJWT, createTemplate);
router.get("/",authenticateJWT, getAllTemplates);
router.get("/:id",authenticateJWT, getTemplate);
router.put("/:id",authenticateJWT, updateTemplate);
router.delete("/:id",authenticateJWT, deleteTemplate);

export default router;
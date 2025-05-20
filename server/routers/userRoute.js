import { Router } from "express";
import {updateUser, getUser} from "../controllers/userController.js";

const router = Router();

router.get("/:id", getUser);
router.put("/:id", updateUser);

export default router;
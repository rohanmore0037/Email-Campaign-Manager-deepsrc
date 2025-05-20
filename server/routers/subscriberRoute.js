import { Router } from "express";
import { createSubscriber, getSubscribers, deleteSubscriber, updateSubscriber } from "../controllers/subscriberController.js";
import multer from "multer";
import authenticateJWT from '../middlewares/authenticate.js';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Subscriber routes
router.post("/", authenticateJWT, upload.single('file'), createSubscriber);
router.get("/:id", authenticateJWT, getSubscribers);
router.delete("/:id", authenticateJWT, deleteSubscriber);
router.put("/:id", authenticateJWT, updateSubscriber);

export default router;
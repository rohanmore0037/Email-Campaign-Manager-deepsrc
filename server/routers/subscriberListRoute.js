import { Router } from "express";
import { createSubscriberList, getSubscriberLists, getSubscriberListsbyId, deleteSubscriberList, updateSubscriberList,exportCSV } from "../controllers/subscriberListController.js";
import authenticateJWT from '../middlewares/authenticate.js';

const router = Router();

router.post("/", authenticateJWT, createSubscriberList);
router.get("/", authenticateJWT, getSubscriberLists);
router.get("/export-csv/:id", authenticateJWT, exportCSV);
router.get("/:id", authenticateJWT, getSubscriberListsbyId);
router.delete("/:id", authenticateJWT, deleteSubscriberList);
router.put("/:id", authenticateJWT, updateSubscriberList);

export default router;

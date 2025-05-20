import { Router } from "express";
import {createServer, getServers, getServerById, deleteServer, updateServer} from "../controllers/smtpController.js";
import authenticateJWT from "../middlewares/authenticate.js";

const router = Router();

router.post("/",authenticateJWT, createServer);      
router.get("/",authenticateJWT, getServers);         
router.get("/:id",authenticateJWT, getServerById);
router.delete("/:id",authenticateJWT, deleteServer); 
router.put("/:id",authenticateJWT, updateServer);     

export default router;
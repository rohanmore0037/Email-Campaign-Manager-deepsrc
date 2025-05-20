import { Router } from "express";
import { createCampaign, getCampaigns,getCampaignbyId, updateCampaignbyId, deleteCampaign, runCampaignById, terminateCampaignById, pauseCampaignById, resumeCampaignById, scheduleCampaignById ,getDetails} from "../controllers/campaignController.js";
import authenticateJWT from "../middlewares/authenticate.js";

const router = Router();

router.post("/",authenticateJWT, createCampaign); 
router.get("/",authenticateJWT, getCampaigns);
router.get("/:id",authenticateJWT, getCampaignbyId); 
router.put("/:id",authenticateJWT, updateCampaignbyId); 
router.delete("/:id",authenticateJWT, deleteCampaign); 
router.get("/details/:id",authenticateJWT, getDetails);

router.get("/start/:id",authenticateJWT, runCampaignById);
router.get("/pause/:id",authenticateJWT, pauseCampaignById);
router.get("/resume/:id",authenticateJWT, resumeCampaignById);
router.get("/terminate/:id",authenticateJWT, terminateCampaignById);
router.post("/schedule/:id",authenticateJWT, scheduleCampaignById);

export default router;
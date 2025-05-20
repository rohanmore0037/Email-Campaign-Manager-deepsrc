import express from 'express';
import { getMailLogsByCampaign } from '../controllers/afterCampaignController.js';
import authenticateJWT from '../middlewares/authenticate.js';

const router = express.Router();

router.get("/:id",authenticateJWT,getMailLogsByCampaign)

export default router;
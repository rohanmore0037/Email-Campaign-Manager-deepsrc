import Campaign from '../models/campaignModel.js';
import Template from '../models/templateModel.js';
import Subscriber from '../models/subcriberModel.js';
import { addToCampaignQueue, cleanupCampaignQueue } from '../mailService/queue.js';

export const createCampaign = async (req, res) => {
    try {
        const { name, smtp, template, subject, subscriberList } = req.body;

        const campaign = await Campaign.create({
            name,
            smtp,
            owner: req.user.id,
            template,
            subject,
            subscriberList,
            status: 0
        });

        res.status(201).json({ campaign, success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id,{
            name:1,
            smtp:1,
            template:1,
            subject:1,
            createdAt:1,
        }).populate('template',{
            _id:0,
            name:1,
            content:1
        })
        .populate('smtp',{
            _id:0,
            servername:1,
        });
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.status(200).json({ campaign, success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find({ owner: req.user.id });
        res.status(200).json({ campaigns, success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getCampaignbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json({ campaign, success: true });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid campaign ID format' });
        }
        res.status(400).json({ message: error.message });
    }
};

export const updateCampaignbyId = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, smtp, template, subject, subscriberList } = req.body;

        const campaign = await Campaign.findByIdAndUpdate(
            id,
            { name, smtp, template, subject, subscriberList, status: 0 },
            { new: true }
        );



        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        res.status(200).json({ campaign, success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteCampaign = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findByIdAndDelete(id);

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        // Clean up campaign queue if it exists
        await cleanupCampaignQueue(id);

        res.status(200).json({ message: 'Campaign deleted', success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const runCampaignById = async (req, res) => {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    try {

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }

        const template = await Template.findById(campaign.template);
        if (!template) {
            return res.status(404).json({ message: 'Template not found' });
        }

        const subscribers = await Subscriber.find({
            subscriberList: { $in: campaign.subscriberList }
        });

        if (subscribers.length === 0) {
            return res.status(400).json({ 
                message: 'No subscribers found for this campaign',
                success: false 
            });
        }
        
        // Set status to running (1)
        campaign.status = 1;
        await campaign.save();

        // Add emails to campaign-specific queue
        for (let i = 0; i < subscribers.length; i++) {
            const subscriber = subscribers[i];
            const smtpId = campaign.smtp[i % campaign.smtp.length];

            await addToCampaignQueue(campaign._id, {
                smtpId,
                to: subscriber.email,
                subject: campaign.subject,
                html: template.content
            });
        }
        
        res.status(200).json({
            message: 'Campaign started',
            emailsQueued: subscribers.length,
            success: true
        });
    } catch (error) {
        // If there's an error, revert campaign status to created (0)
        if (campaign) {
            campaign.status = 0;
            await campaign.save();
        }
        res.status(400).json({ message: error.message });
    }
};

export const pauseCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        campaign.status = 3; // pause status
        await campaign.save();
        // Queue cleanup will be handled by Bull's pause functionality
        res.status(200).json({ message: 'Campaign paused', success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const terminateCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        campaign.status = 4; // terminate status
        await campaign.save();
        
        // Clean up the campaign's queue
        await cleanupCampaignQueue(id);
        
        res.status(200).json({ message: 'Campaign terminated', success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const resumeCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        campaign.status = 1; // running status
        await campaign.save();
        res.status(200).json({ message: 'Campaign resumed', success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const scheduleCampaignById = async (req, res) => {
    try {
        const { id } = req.params;
        const campaign = await Campaign.findById(id);
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        campaign.status = 5; // schedule status
        await campaign.save();
        res.status(200).json({ message: 'Campaign scheduled', success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

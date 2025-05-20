import Aftercampaign from '../models/afterCampaignModel.js';

export const createMailLog = async (email,campaignId, smtpServer) => {
    try {
        const mailLog = await Aftercampaign.create({
            reciever:email,
            campaignid: campaignId,
            status: 0 ,
            smtpserver: smtpServer
        });
        return mailLog;
    } catch (error) {
        console.error('Error creating mail log:', error);
        throw error;
    }
};

export const updateMailStatus = async (mailLogId, success) => {
    try {
        const mailLog = await Aftercampaign.findByIdAndUpdate(
            mailLogId,
            {
                status: success ? 1 : 0,
                updatedAt: Date.now()
            },
            { new: true }
        );
        return mailLog;
    } catch (error) {
        console.error('Error updating mail status:', error);
        throw error;
    }
};

export const getMailLogsByCampaign = async (req,res) => {
    try {
        
        const { id } = req.params;

        const mailLogs = await Aftercampaign.find({ campaignid: id }, { reciever: 1, status: 1, smtpserver: 1, timing:1,_id: 0 })

        res.status(200).json({ mailLogs, success: true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
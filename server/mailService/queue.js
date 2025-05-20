import Queue from 'bull';
import { sendEmail } from './mailer.js';
import Campaign from '../models/campaignModel.js';
import Smtp from '../models/smtpModel.js';
import { createMailLog, updateMailStatus } from '../controllers/afterCampaignController.js';

const campaignQueues = new Map();

export const createCampaignQueue = (campaignId) => {
  const queueName = `campaign-${campaignId}`;

  if (!campaignQueues.has(queueName)) {
    const queue = new Queue(queueName, {
      redis: {
        port: process.env.REDIS_PORT || 6379,
        host: process.env.REDIS_HOST || '127.0.0.1',
      },
    });

    queue.process(async (job) => {
      const { smtpId, to, subject, html } = job.data;
      try {
        const smtpConfig = await Smtp.findById(smtpId)
        const mailLog = await createMailLog(to, campaignId, smtpConfig.servername);

        await sendEmail(smtpConfig, { to, subject, html });

        await updateMailStatus(mailLog._id, true);

        return { success: true, to, mailLogId: mailLog._id };
      } catch (error) {
        if (job.data.mailLogId) {
          await updateMailStatus(job.data.mailLogId, false);
        }
        throw new Error(`Failed to process email job: ${error.message}`);
      }
    });

    // Listen for queue completion
    queue.on('completed', async (job) => {
      const total = await queue.getJobCounts();
      if (total.active === 0 && total.waiting === 0) {
        try {
          await Campaign.findByIdAndUpdate(campaignId, { status: 2 });
          await cleanupCampaignQueue(campaignId);
        } catch (error) {
          console.error('Error updating campaign status:', error);
        }
      }
    });

    queue.on('failed', async (job, error) => {
      console.error(`Email job failed for campaign ${campaignId}:`, error);
    });

    campaignQueues.set(queueName, queue);
  }

  return campaignQueues.get(queueName);
};

export const addToCampaignQueue = async (campaignId, data) => {
  const queue = createCampaignQueue(campaignId);
  return await queue.add(data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

export const cleanupCampaignQueue = async (campaignId) => {
  const queueName = `campaign-${campaignId}`;
  const queue = campaignQueues.get(queueName);
  if (queue) {
    await queue.close();
    campaignQueues.delete(queueName);
  }
};

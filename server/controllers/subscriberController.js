import Subscriber from '../models/subcriberModel.js';
import SubscriberList from '../models/subcriberlistModel.js';
import parseCSV from '../utils/parseCSV.js';
import fs from 'fs';

export const createSubscriber = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { name, tag } = req.body;
    const ownerId = req.user.id;

    // 1. Create subscriber list
    const subscriberList = await SubscriberList.create({
      name,
      tag,
      owner: ownerId
    });

    // 2. Parse CSV file
    const records = await parseCSV(req.file.path);
    const subscribers = [];
    
    // 3. Process records
    for (const record of records) {
      if (record.email && record.name) {
        subscribers.push({
          email: record.email,
          name: record.name,
          subscriberList: subscriberList._id
        });
      }
    }

    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No valid subscribers found in the file' });
    }

    // 4. Insert subscribers
    await Subscriber.insertMany(subscribers);
    
    // 5. Clean up and send response
    fs.unlinkSync(req.file.path);
    res.status(201).json({
      message: 'Subscribers imported successfully',
      subscriberList: subscriberList,
      success: true
    });

  } catch (err) {
    // Clean up uploaded file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    if (err.code === 11000) {
      await SubscriberList.findByIdAndDelete(subscriberList._id);
      return res.status(400).json({
        message: 'Some email addresses are duplicated within this list',
        error: 'Each email must be unique within a subscriber list'
      });
    }
    
    res.status(500).json({ message: err.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const { id } = req.params;
    const subscribers = await Subscriber.find({ subscriberList: id });
    res.status(200).json({ subscribers, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    await Subscriber.findByIdAndDelete(id);
    res.status(200).json({ message: 'Subscriber deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSubscriber = async (req, res) => {
  try {
    const { id } = req.params;
    const subscriber = await Subscriber.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(subscriber);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

import SubscriberList from '../models/subcriberlistModel.js';
import Subscriber from '../models/subcriberModel.js';
import { format } from '@fast-csv/format';

export const createSubscriberList = async (req, res) => {
  try {
    const { name, tag } = req.body;
    const owner = req.user.id;

    const subscriberList = await SubscriberList.create({
      name,
      tag,
      owner
    });

    res.status(201).json({ subscriberList, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSubscriberLists = async (req, res) => {
  try {
    const lists = await SubscriberList.find({ owner: req.user.id });
    res.status(200).json({ lists, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const exportCSV = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Subscriber.find({ subscriberList: id }, 'email name').lean();

    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'No subscribers found for this list' });
    }

    const subscribers = data.map(subscriber => ({
      name: subscriber.name,
      email: subscriber.email,
    }));

    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.setHeader('Content-Type', 'text/csv');

    const csvStream = format({ headers: true });
    csvStream.pipe(res);
    subscribers.forEach(sub => csvStream.write(sub));
    csvStream.end();

  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

export const getSubscriberListsbyId = async (req, res) => {
  try {
    const { id } = req.params;
    const list = await SubscriberList.findById(id)
    if (!list) {
      return res.status(404).json({ message: 'Subscriber list not found' });
    }
    res.status(200).json({ list, success: true });
  }
  catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid subscriber list ID format' });
    }
    res.status(400).json({ message: error.message });
  }
}

export const deleteSubscriberList = async (req, res) => {
  try {
    const { id } = req.params;

    await Subscriber.deleteMany({ subscriberList: id });

    await SubscriberList.findByIdAndDelete(id);

    res.status(200).json({ message: 'Subscriber list and associated subscribers deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateSubscriberList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tag } = req.body;

    const list = await SubscriberList.findByIdAndUpdate(
      id,
      { name, tag, updatedAt: Date.now() },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ message: 'Subscriber list not found' });
    }

    res.status(200).json(list);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

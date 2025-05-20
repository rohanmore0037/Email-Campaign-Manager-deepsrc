import Smtp from '../models/smtpModel.js';

export const createServer = async (req, res) => {
    try {
        const { servername, host, port, username, password, protocol } = req.body;
        const smtp = new Smtp({
            servername,
            host,
            port,
            username,
            password,
            protocol,
            owner: req.user.id
        });
        await smtp.save();
        res.status(201).json({message:"server saved",success:true});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getServers = async (req, res) => {
    try {
        const smtps = await Smtp.find({ owner: req.user.id });
        res.status(200).json({smtps, success:true});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getServerById = async (req, res) => {
    try {
        const { id } = req.params;
        const smtp = await Smtp.findOne({ _id: id, owner: req.user.id });
        if (!smtp) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json(smtp);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteServer = async (req, res) => {
    try {
        const { id } = req.params;
        await Smtp.findByIdAndDelete(id);
        res.status(200).json({ message: 'SMTP server deleted',success:true });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateServer = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = {
            ...req.body,
            updatedAt: Date.now()
        };
        const smtp = await Smtp.findOneAndUpdate(
            { _id: id, owner: req.user.id },
            updates,
            { new: true }
        );
        if (!smtp) {
            return res.status(404).json({ message: 'Server not found' });
        }
        res.status(200).json({smtp, success:true});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

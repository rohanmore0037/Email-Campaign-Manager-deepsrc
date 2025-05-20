import Template from "../models/templateModel.js";

export const createTemplate = async (req, res) => {
    try {
        const { name, content, type } = req.body;
        const owner = req.user.id;
        if (!name || !content || !type) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTemplate = new Template({
            name,
            content,
            type,
            owner,
        });
        const savedTemplate = await newTemplate.save();
        res.status(201).json({ savedTemplate, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error creating template", error: error.message });
    }
}

export const getAllTemplates = async (req, res) => {
    try {
        const ownerId = req.user.id
        if (!ownerId) {
            return res.status(400).json({ message: "User ID not found in request", success: false });
        }

        const templates = await Template.find({ owner: ownerId })
            .populate("owner", "name email")
            .exec();

        res.status(200).json({ templates, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error fetching templates", error: error.message });
    }
};

export const getTemplate = async (req, res) => {
    try{
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Template ID is required" });
        }

        const template = await Template.findById(id)
            .populate("owner", "name email")
            .exec();

        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        res.status(200).json({ template, success: true });
    }catch (error) {
        res.status(500).json({ message: "Error fetching template", error: error.message });
    }
}

export const updateTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, content, type } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Template ID is required" });
        }

        const template = await Template.findById(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        template.name = name || template.name;
        template.content = content || template.content;
        template.type = type || template.type;
        template.updatedAt = Date.now();
        const updatedTemplate = await template.save();
        res.status(200).json({ updatedTemplate, success: true });
    } catch (error) {
        res.status(500).json({ message: "Error updating template", error: error.message });
    }
}

export const deleteTemplate = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Template ID is required" });
        }

        const template = await Template.findById(id);
        if (!template) {
            return res.status(404).json({ message: "Template not found" });
        }

        await Template.findByIdAndDelete(id);
        res.status(200).json({ message: "Template deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting template", error: error.message });
    }
}

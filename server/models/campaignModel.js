//name, serverid, owner,template,subject,subcriberlsit id
import mongoose, { Schema } from "mongoose";

const campaignSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    smtp: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Smtp",
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    template: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Template",
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    subscriberList: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Subsriberlist",
        required: true,
    },
    schedule: {
        type: Date,
        default: undefined
    },
    status: {
        type: Number,
        enum: [0, 1, 2, 3, 4, 5],//create, running ,complete, pause ,terminate, schedule,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

const Campaign = mongoose.model("Campaign", campaignSchema);
export default Campaign;
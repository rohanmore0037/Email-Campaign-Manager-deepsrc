import mongoose from "mongoose";

const afterCampaignSchema = new mongoose.Schema({
    reciever:{
        type: String,
        required: true
    },
    campaignid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    status:{
        type: Number,
        enum: [0,1], //0=not sent,1=sent
        default: 0
    },
    smtpserver:{
        type: String,
        required: true
    },
    timing: {
        type: Date,
        default: Date.now,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
}); 

const Aftercampaign = mongoose.model("Aftercampaign", afterCampaignSchema);
export default Aftercampaign;
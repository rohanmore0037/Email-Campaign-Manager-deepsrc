import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    subscriberList: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriberList", 
        required: true,
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


const Subscriber = mongoose.model("Subscriber", subscriberSchema);
export default Subscriber;
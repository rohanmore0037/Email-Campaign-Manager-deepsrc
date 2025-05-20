import mongoose from "mongoose";

//password username protocol(tls,ssl)
const smtpSchema = new mongoose.Schema({
    servername:{
        type: String,
        required: true,
    },
    host: {
        type: String,
        required: true,
    },
    port: {
        type: Number,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    protocol:{
        type: String,
        enum: ["tls", "ssl"],
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active",
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
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

const Smtp = mongoose.model("Smtp", smtpSchema);
export default Smtp;
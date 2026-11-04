import mongoose from "mongoose";

const connectionSchema = new mongoose.Schema({
    from: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: mongoose.Schema.Types.ObjectId, enum: ["pending", "accepted", "rejected"], default: "pending" }
}, { timestamps: true });

const Connection = mongoose.model("Connection", connectionSchema);

export default Connection;
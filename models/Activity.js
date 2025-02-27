import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        action: {
            type: String,
            required: true,
            enum: ["read", "like", "comment", "publish", "update"],
        },
        entity: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        entityType: {
            type: String,
            required: true,
            enum: ["blog", "comment", "reply", "profile"],
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

export default mongoose.models?.Activity || mongoose.model("Activity", activitySchema);

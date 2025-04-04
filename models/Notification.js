import mongoose, { Schema } from "mongoose";

const notificationSchema = mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["like", "comment", "reply"],
            required: true,
        },
        blog: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "Blog",
        },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        notification_for: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        comment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        reply: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
        seen: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models?.Notification || mongoose.model("Notification", notificationSchema);

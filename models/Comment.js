import mongoose, { Schema } from "mongoose";

const commentSchema = mongoose.Schema(
    {
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
        comment: {
            type: String,
            required: true,
        },
        parentComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        },
    },
    {
        timestamps: {
            createdAt: "commentedAt",
            updatedAt: "editedAt",
        },
    }
);

export default mongoose.models?.Comment || mongoose.model("Comment", commentSchema);

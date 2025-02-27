import mongoose from "mongoose";

const magicLinkSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        unique: true,
    },
    code: {
        type: String,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    used: {
        type: Boolean,
        default: false,
    },
    account_created: {
        type: Boolean,
        default: false,
    },
});

export default mongoose.models?.MagicLink || mongoose.model("MagicLink", magicLinkSchema);

import mongoose, { Schema } from "mongoose";

const blogSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
        },
        des: {
            type: String,
            maxlength: 200,
        },
        content: {
            type: [],
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        categories: {
            type: Schema.Types.ObjectId,
            ref: "Category",
        },
        subcategories: {
            type: Schema.Types.ObjectId,
            ref: "Subcategory",
        },
        tags: {
            type: [Schema.Types.ObjectId],
            ref: "Tag",
        },
        activity: {
            total_likes: {
                type: Number,
                default: 0,
            },
            total_comments: {
                type: Number,
                default: 0,
            },
            total_reads: {
                type: Number,
                default: 0,
            },
        },
        show_comments: {
            type: Boolean,
            default: true,
        },
        draft: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: {
            createdAt: "publishedAt",
            updatedAt: "editedAt",
        },
    }
);

export default mongoose.models?.Blog || mongoose.model("Blog", blogSchema);

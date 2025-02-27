import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Comment from "@/models/Comment";

async function handler(req) {
    try {
        const { blog, skip = 0 } = await req.json();
        const maxLimit = process.env.MAX_LIMIT;

        const comments = await Comment.find({ blog, parentComment: null })
            .sort({ commentedAt: -1 })
            .skip(skip)
            .limit(maxLimit)
            .populate(
                "user",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .select("-parentComment");

        return response(200, "success", { comments });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

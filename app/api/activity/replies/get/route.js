import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Comment from "@/models/Comment";
import { withAuth } from "@/middleware/withAuth";

async function handler(req) {
    try {
        const { _id, skip = 0 } = await req.json();
        const maxLimit = process.env.MAX_LIMIT;

        const replies = await Comment.find({ parentComment: _id })
            .populate(
                "user",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .sort({ commentedAt: 1 })
            .skip(skip)
            .limit(maxLimit)
            .select("-blog -updatedAt -parentComment");

        return response(200, "success", { replies });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

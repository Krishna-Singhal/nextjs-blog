import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Comment from "@/models/Comment";

async function handler(req) {
    try {
        const _id = req.nextUrl.searchParams.get("_id");
        const page = req.nextUrl.searchParams.get("page") || 1;

        if (!_id) {
            return response(400, "Comment Id is required");
        }
        const maxLimit = process.env.MAX_LIMIT;
        const skipDocs = (page - 1) * maxLimit;

        const replies = await Comment.find({ parentComment: _id })
            .populate(
                "user",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .sort({ commentedAt: 1 })
            .skip(skipDocs)
            .limit(maxLimit)
            .select("-blog -updatedAt");

        return response(200, "success", { replies });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

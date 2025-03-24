import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Comment from "@/models/Comment";

async function handler(req) {
    try {
        const blog = req.nextUrl.searchParams.get("blog");
        const page = req.nextUrl.searchParams.get("page") || 1;

        if (!blog) {
            return response(400, "Blog Id is required");
        }

        let maxLimit = process.env.MAX_LIMIT;
        let skipDocs = (page - 1) * maxLimit;

        const comments = await Comment.find({ blog, parentComment: null })
            .sort({ commentedAt: -1 })
            .skip(skipDocs)
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

export const GET = applyMiddlewares(withDB)(handler);

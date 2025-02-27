import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";

async function handler(req) {
    try {
        const { page } = await req.json();
        const maxLimit = process.env.MAX_LIMIT;

        const blogs = await Blog.find({ draft: false })
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("tags", "-_id")
            .sort({ publishedAt: -1 })
            .select("slug title des banner activity tags publishedAt -_id")
            .skip((page - 1) * maxLimit)
            .limit(maxLimit);

        return response(200, "success", { blogs });
    } catch (err) {
        console.error(err);
        return response(500, "Internal server error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

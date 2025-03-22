import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";

async function handler(req) {
    try {
        const slug = req.nextUrl.searchParams.get("slug");

        if (!slug) {
            return response(400, "Slug is required");
        }
        const blog = await Blog.findOne({ slug }, { "activity.total_comments": 1 });

        if (!blog) {
            return response(404, "Blog not found");
        }

        const comments = blog.activity?.total_comments ?? 0;

        return response(200, "success", { comments });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

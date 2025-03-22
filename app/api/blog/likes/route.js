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
        const blog = await Blog.findOne({ slug }, { "activity.total_likes": 1 });

        if (!blog) {
            return response(404, "Blog not found");
        }

        const likes = blog.activity?.total_likes ?? 0;

        return response(200, "success", { likes });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

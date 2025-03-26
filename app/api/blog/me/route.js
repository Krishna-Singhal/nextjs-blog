import { response } from "@/utils/response";
import { withAuth } from "@/middleware/withAuth";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import Blog from "@/models/Blog";
import { withDB } from "@/middleware/withDB";

async function handler(req) {
    try {
        const { page, draft, query } = await req.json();
        const user_id = req.user;

        const maxLimit = process.env.MAX_LIMIT;
        const skipDocs = (page - 1) * maxLimit;

        const blogs = await Blog.find({ author: user_id, draft, title: new RegExp(query, "i") })
            .skip(skipDocs)
            .limit(maxLimit)
            .sort({ publishedAt: -1 })
            .select("title banner publishedAt slug activity des draft -_id");

        return response(200, "success", { blogs });
    } catch (err) {
        console.error(err);
        return response(500, "Internal server error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

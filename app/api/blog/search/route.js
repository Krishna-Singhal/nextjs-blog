import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";

async function handler(req) {
    try {
        const { tag, page = 1, query, author, eliminate_blog } = await req.json();
        const maxLimit = process.env.MAX_LIMIT;

        let findquery = { draft: false };

        if (tag) {
            findquery.tags = tag;
            findquery.slug = { $ne: eliminate_blog };
        } else if (query) {
            findquery.title = new RegExp(query, "i");
        } else if (author) {
            findquery.author = author;
        }

        const blogs = await Blog.find(findquery)
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("tags", "-_id")
            .sort({ publishedAt: -1 })
            .select("slug title des banner activity tags publishedAt -_id")
            .skip(Math.max(0, page - 1) * maxLimit)
            .limit(maxLimit);

        return response(200, "success", { blogs });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

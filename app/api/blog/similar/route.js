import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";

async function handler(req) {
    try {
        const tags = req.nextUrl.searchParams.get("tags");
        const eliminate_blog = req.nextUrl.searchParams.get("eliminate_blog");
        const maxLimit = 6;

        if (!tags) {
            return response(400, "Tags are required");
        }
        const tagArray = tags.split(",");

        let findquery = { draft: false, tags: { $in: tagArray }, slug: { $ne: eliminate_blog } };

        const blogs = await Blog.find(findquery)
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("tags", "-_id")
            .sort({ publishedAt: -1 })
            .select("slug title des banner author activity tags publishedAt -_id")
            .limit(maxLimit);

        return response(200, "success", { blogs });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

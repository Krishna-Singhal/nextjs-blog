import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";
import Tag from "@/models/Tag";

async function handler(req) {
    try {
        const tag = req.nextUrl.searchParams.get("tag");
        const page = req.nextUrl.searchParams.get("page") || 1;
        const maxLimit = process.env.MAX_LIMIT;
        let query = { draft: false };
        if (tag && tag != "for-you") {
            const tagObj = await Tag.findOne({ slug: tag }).select("_id");
            if (tagObj) {
                query.tags = tagObj._id;
            }
        }
        const skipDocs = (page - 1) * maxLimit;

        const blogs = await Blog.find(query)
            .skip(skipDocs)
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("tags", "-_id")
            .sort({
                "activity.total_reads": -1,
                "activity.total_likes": -1,
                publishedAt: -1,
            })
            .select("slug title des banner activity author tags publishedAt -_id")
            .limit(maxLimit);

        return response(200, "success", { blogs });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

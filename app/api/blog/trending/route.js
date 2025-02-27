import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";

async function handler() {
    try {
        const maxLimit = process.env.MAX_LIMIT;

        const blogs = await Blog.find({ draft: false })
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("tags", "-id")
            .sort({
                "activity.total_reads": -1,
                "activity.total_likes": -1,
                publishedAt: -1,
            })
            .select("slug title publishedAt -_id")
            .limit(maxLimit);

        return response(200, "success", { blogs });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

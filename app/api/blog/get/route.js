import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { withDB } from "@/middleware/withDB";

async function handler(req) {
    try {
        const { slug, draft, mode } = await req.json();
        const incrementVal = mode !== "edit" ? 1 : 0;

        const blog = await Blog.findOneAndUpdate(
            { slug },
            { $inc: { "activity.total_reads": incrementVal } },
            { new: true }
        )
            .populate(
                "author",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("tags", "-_id")
            .select("title des content banner activity publishedAt slug tags draft -_id");

        if (!blog) {
            return response(404, "Blog not found");
        }

        if (blog.draft && !draft) {
            return response(403, "This blog is in draft mode.");
        }

        if (incrementVal > 0) {
            User.findOneAndUpdate(
                { "personal_info.username": blog.author.personal_info.username },
                { $inc: { "account_info.total_reads": incrementVal } }
            ).catch(console.error);
        }

        return response(200, "success", { blog });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

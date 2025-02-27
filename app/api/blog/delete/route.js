import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import withAuth from "@/middlewares/withAuth";
import Blog from "@/models/Blog";
import Notification from "@/models/Notification";
import Comment from "@/models/Comment";
import User from "@/models/User";
import { withDB } from "@/middleware/withDB";

async function handler(req) {
    try {
        const user_id = req.user;
        const { slug } = await req.json();

        const blog = await Blog.findOneAndDelete({ slug, author: user_id });

        if (!blog) {
            return response(404, "Blog not found or you are not authorized to delete it.");
        }

        await Promise.all([
            Notification.deleteMany({ blog: blog._id }),
            Comment.deleteMany({ blog: blog._id }),
            User.findByIdAndUpdate(user_id, {
                $inc: { "account_info.total_posts": blog.draft ? 0 : -1 },
            }),
        ]);

        return response(200, "Blog deleted successfully");
    } catch (err) {
        console.error(err);
        return response(500, "Internal server error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

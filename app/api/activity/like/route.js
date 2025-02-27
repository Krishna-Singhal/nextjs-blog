import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Blog from "@/models/Blog";
import Notification from "@/models/Notification";
import { withAuth } from "@/middleware/withAuth";
import Like from "@/models/Like";

async function handler(req) {
    try {
        const user_id = req.user;
        const { _id } = await req.json();

        let incrementVal;
        let like = await Like.findOne({ user: user_id, blog: _id });
        if (!like) {
            const saveLike = new Like({
                user: user_id,
                blog: _id,
            });
            like = await saveLike.save();
            incrementVal = 1;
        } else {
            incrementVal = -1;
            await Like.findByIdAndDelete(like._id);
        }

        const blog = await Blog.findOneAndUpdate(
            { _id },
            { $inc: { "activity.total_likes": incrementVal } },
            { new: true }
        );

        if (!blog) {
            return response(404, "Blog not found");
        }

        if (incrementVal > 0) {
            const noti = new Notification({
                type: "like",
                blog: _id,
                user: user_id,
                notification_for: blog.author,
            });

            await noti.save();
        } else {
            await Notification.deleteOne({ blog: _id, user: user_id, type: "like" });
        }

        return response(200, "success");
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

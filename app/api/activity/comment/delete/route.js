import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Comment from "@/models/Comment";
import Blog from "@/models/Blog";
import Notification from "@/models/Notification";
import { withAuth } from "@/middleware/withAuth";

async function deleteComments(commentId) {
    const comment = await Comment.findOneAndDelete({ _id: commentId });

    if (!comment) return;

    await Notification.deleteMany({ comment: commentId });

    const replies = await Comment.find({ parentComment: commentId });
    for (const reply of replies) {
        await deleteComments(reply._id);
    }

    await Blog.findOneAndUpdate(
        { _id: comment.blog },
        {
            $inc: {
                "activity.total_comments": -1,
            },
        }
    );
}

async function handler(req) {
    try {
        const user_id = req.user;
        const { _id } = await req.json();

        const comment = await Comment.findOne({ _id });

        if (!comment) {
            return response(404, "Comment not found");
        }

        if (user_id == comment.user.toString() || user_id == comment.blog.author.toString()) {
            await deleteComments(_id);
            return response(200, "success");
        } else {
            return response(403, "You are not authorized to delete this comment");
        }
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

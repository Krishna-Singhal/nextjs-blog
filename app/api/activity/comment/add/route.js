import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Comment from "@/models/Comment";
import Blog from "@/models/Blog";
import Notification from "@/models/Notification";
import { withAuth } from "@/middleware/withAuth";

async function handler(req) {
    try {
        const user_id = req.user;
        const { _id, comment, parentComment = null, notification_id = null } = await req.json();

        if (!comment?.length) {
            return response(403, "You must provide a comment");
        }

        const commentObj = {
            blog: _id,
            user: user_id,
            comment,
            parentComment,
        };

        const commentFile = await new Comment(commentObj).save();

        let blog = await Blog.findOneAndUpdate(
            { _id },
            {
                $inc: {
                    "activity.total_comments": 1,
                },
            }
        );

        const notificationObj = {
            type: parentComment ? "reply" : "comment",
            blog: _id,
            user: user_id,
            notification_for: blog.author,
            comment: commentFile._id,
        };

        if (parentComment) {
            const parentCommentObj = await Comment.findOne({ _id: parentComment });

            notificationObj.notification_for = parentCommentObj.user;

            if (notification_id) {
                await Notification.findOneAndUpdate(
                    { _id: notification_id },
                    { reply: commentFile._id }
                );
            }
        }

        await new Notification(notificationObj).save();

        return response(200, "success", {
            comment: {
                _id: commentFile._id,
                comment,
                commentedAt: commentFile.commentedAt,
                commented_by: user_id,
            },
        });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import { withAuth } from "@/middleware/withAuth";
import Notification from "@/models/Notification";

async function handler(req) {
    try {
        const user_id = req.user;
        const { page, filter } = await req.json();

        const maxLimit = process.env.MAX_LIMIT;
        let skipDocs = (page - 1) * maxLimit;

        let findQuery = {
            notification_for: user_id,
            user: { $ne: user_id },
        };

        if (filter !== "all") {
            findQuery.type = filter;
        }

        const notifications = await Notification.find(findQuery)
            .skip(skipDocs)
            .limit(maxLimit)
            .populate("blog", "title slug")
            .populate(
                "user",
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            )
            .populate("comment", "comment")
            .populate("reply", "comment")
            .sort({ createdAt: -1 })
            .select("createdAt type seen reply");

        Notification.updateMany(findQuery, { seen: true })
            .skip(skipDocs)
            .limit(maxLimit)
            .catch(console.error);

        return response(200, "success", { notifications });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

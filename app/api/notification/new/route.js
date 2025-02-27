import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import Notification from "@/models/Notification";
import { withAuth } from "@/middleware/withAuth";

async function handler(req) {
    try {
        const user_id = req.user;

        const notifications = await Notification.exists({
            notification_for: user_id,
            seen: false,
            user: { $ne: user_id },
        });

        return response(200, "success", { available: Boolean(notifications) });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withAuth, withDB)(handler);

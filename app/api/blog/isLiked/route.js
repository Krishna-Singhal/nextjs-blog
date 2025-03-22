import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import { withAuth } from "@/middleware/withAuth";
import Like from "@/models/Like";

async function handler(req) {
    try {
        const user_id = req.user;
        const { _id } = await req.json();

        if (!_id) {
            return response(400, "Blog Id is required");
        }
        let like = await Like.findOne({ user: user_id, blog: _id });
        return response(200, "success", { liked: Boolean(like) });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

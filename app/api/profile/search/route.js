import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import User from "@/models/User";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const { query } = await req.json();
        if (!query) {
            return response(400, "Search query is required");
        }

        const users = await User.find({
            "personal_info.fullname": new RegExp(query, "i"),
        })
            .limit(50)
            .select(
                "personal_info.fullname personal_info.username personal_info.profile_img -_id"
            );

        return response(200, { users });
    } catch (error) {
        console.error(error);
        return response(500, "Internal server error", { error: error.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

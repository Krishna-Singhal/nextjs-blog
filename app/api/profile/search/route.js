import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import User from "@/models/User";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const query = req.nextUrl.searchParams.get("query");
        const page = req.nextUrl.searchParams.get("page") || 1;
        if (!query) {
            return response(400, "Search query is required");
        }

        const maxLimit = process.env.MAX_LIMIT;

        const profiles = await User.find({
            "personal_info.fullname": new RegExp(query, "i"),
        })
            .limit(maxLimit)
            .skip(Math.max(0, page - 1) * maxLimit)
            .select("personal_info.fullname personal_info.username personal_info.profile_img -_id");

        return response(200, "success", { profiles });
    } catch (error) {
        console.error(error);
        return response(500, "Internal server error", { error: error.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import User from "@/models/User";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const username = req.nextUrl.searchParams.get("username");

        if (!username) {
            return response(400, "Username is required");
        }

        const profile = await User.findOne({
            "personal_info.username": username,
        }).select("-personal_info.password -google_auth -updatedAt");

        if (!profile) {
            return response(404, "User not found");
        }

        return response(200, "success", { profile });
    } catch (error) {
        console.error(error);
        return response(500, "Internal server error", { error: error.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

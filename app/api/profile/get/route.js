import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import User from "@/models/User";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const { username } = await req.json();
        if (!username) {
            return response(400, "Username is required");
        }

        const user = await User.findOne({
            "personal_info.username": username,
        }).select("-personal_info.password -google_auth -updatedAt");

        if (!user) {
            return response(404, "User not found");
        }

        return response(200, { user });
    } catch (error) {
        console.error(error);
        return response(500, "Internal server error", { error: error.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

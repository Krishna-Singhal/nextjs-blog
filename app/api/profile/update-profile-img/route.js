import { withAuth } from "@/middleware/withAuth";
import { withDB } from "@/middleware/withDB";
import User from "@/models/User";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const { url } = await req.json();

        await User.findByIdAndUpdate(req.user, { "personal_info.profile_img": url });
        return response(200, "success", { profile_img: url });
    } catch (err) {
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

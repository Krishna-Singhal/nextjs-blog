import jwt from "jsonwebtoken";
import User from "@/models/User";
import MagicLink from "@/models/MagicLink";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import { response } from "@/utils/response";
import { setCookie } from "@/app/server/cookies";

async function handler(req) {
    try {
        let { email, code, token } = await req.json();
        if (!(email || code || token)) {
            return response(400, "Missing required fields");
        }

        if (!email) {
            const magicLink = await MagicLink.findOne({ token });
            email = magicLink.email;
        }
        const userObj = await User.findOne({ "personal_info.email": email });
        if (!userObj) {
            return response(403, "Sorry, we didn't recognize that email.");
        }

        let authSuccess = false;

        if (token) {
            const magicLink = await MagicLink.findOne({ email, token });

            if (!magicLink) return response(401, "Invalid token");
            if (magicLink.expiresAt < new Date()) return response(403, "Token expired");
            if (magicLink.used) return response(403, "Token already used.");

            authSuccess = true;
            magicLink.used = true;
            await magicLink.save();
        } else if (code) {
            const magicCode = await MagicLink.findOne({ email, code });

            if (!magicCode) return response(401, "Invalid code");
            if (magicCode.expiresAt < new Date()) return response(403, "Code expired");
            if (magicCode.used) return response(403, "Code already used");

            authSuccess = true;
            magicCode.used = true;
            await magicCode.save();
        }

        if (!authSuccess) {
            return response(403, "Authentication failed");
        }

        const access_token = jwt.sign({ id: userObj._id }, process.env.SECRET_ACCESS_KEY);
        const user = {
            access_token,
            profile_img: userObj.personal_info.profile_img,
            username: userObj.personal_info.username,
            fullname: userObj.personal_info.fullname,
            email: userObj.personal_info.email,
        };
        await setCookie("user", user);
        return response(200, "User authenticated successfully", { user });
    } catch (error) {
        return response(500, "Internal Server Error", { error: error.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

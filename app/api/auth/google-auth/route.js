import User from "@/models/User";
import { withDB } from "@/middleware/withDB";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { response } from "@/utils/response";
import jwt from "jsonwebtoken";
import { generateUsername } from "../sign-up/route";
import { setCookie } from "@/app/server/cookies";

async function handler(req) {
    try {
        const { token } = await req.json();
        const googleRes = await fetch(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
        );
        const googleUser = await googleRes.json();
        if (!googleUser.email) {
            return response(401, "Invalid Google OAuth token");
        }
        let { email, name, picture } = googleUser;
        picture = picture.replace("s96-c", "s3384-c");

        let userObj = await User.findOne({ "personal_info.email": email })
            .select(
                "personal_info.fullname personal_info.username personal_info.email personal_info.profile_img google_auth"
            )
            .catch((err) => {
                return response(500, "Internal Server Error", { error: err.message });
            });

        if (!userObj) {
            const username = await generateUsername(email);
            userObj = new User({
                personal_info: {
                    fullname: name,
                    email,
                    username,
                    profile_img: picture,
                },
                google_auth: true,
            });

            await userObj.save().catch((err) => {
                return response(500, "Internal Server Error", {
                    error: err.message,
                });
            });
        } else {
            if (!userObj.google_auth) {
                userObj.google_auth = true;
            }
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
        return response(200, "User authenticated successfully", {
            user,
        });
    } catch (error) {
        console.error(error);
        return response(500, "Failed to authenticate with Google, try a different account.", {
            error: error.message,
        });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

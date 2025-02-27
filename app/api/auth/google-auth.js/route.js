import { NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import User from "@/models/User";
import { withDB } from "@/middleware/withDB";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { response } from "@/utils/response";
import { generateUsername } from "../sign-up/route";

async function handler(req) {
    try {
        const { access_token } = await req.json();
        if (!access_token) {
            return response(400, "Access token is required");
        }

        const decodedToken = await getAuth().verifyIdToken(access_token);
        let { email, name, picture } = decodedToken;
        picture = picture.replace("s9c-c", "s3384-c");

        let user = await User.findOne({ "personal_info.email": email })
            .select(
                "personal_info.fullname personal_info.username personal_info.email personal_info.profile_img google_auth"
            )
            .catch((err) => {
                return NextResponse.json(
                    { error: err.message },
                    { status: 500 }
                );
            });

        if (user) {
            if (!user.google_auth) {
                return response(
                    403,
                    "This email was signed up without Google. Please login with email and password."
                );
            }
        } else {
            const username = await generateUsername(email);
            user = new User({
                personal_info: {
                    fullname: name,
                    email,
                    username,
                    profile_img: picture,
                },
                google_auth: true,
            });

            await user.save().catch((err) => {
                return response(500, "Internal Server Error", {
                    error: err.message,
                });
            });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_ACCESS_KEY);
        return response(200, "User authenticated successfully", {
            user: {
                access_token: token,
                profile_img: user.personal_info.profile_img,
                username: user.personal_info.username,
                fullname: user.personal_info.fullname,
                email: user.personal_info.email,
            },
        });
    } catch (error) {
        console.error(error);
        return response(
            500,
            "Failed to authenticate with Google, try a different account.",
            { error: error.message }
        );
    }
}

export const POST = applyMiddlewares(withDB)(handler);

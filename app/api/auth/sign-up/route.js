import { nanoid } from "nanoid";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import { response } from "@/utils/response";
import MagicLink from "@/models/MagicLink";
import { setCookie } from "@/actions/cookies";

export const generateUsername = async (email) => {
    let username = email.split("@")[0];
    let isUsernameNotunique = await User.exists({
        "personal_info.username": username,
    }).then((result) => result);
    if (isUsernameNotunique) {
        username += nanoid(4).toString().toLowerCase();
    }
    return username;
};

async function handler(req) {
    try {
        const { fullname, email, token } = await req.json();

        const existingUser = await User.findOne({
            "personal_info.email": email,
        });

        if (existingUser) {
            return response(403, "Email already exists");
        }

        if (!token) {
            return response(403, "Token is required");
        }

        if (!fullname || fullname.length < 3) {
            return response(403, "Name must be at least 3 characters long");
        }

        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || !emailRegex.test(email)) {
            return response(403, "Invalid email format");
        }

        const magicLink = await MagicLink.findOne({ token });

        if (!magicLink) {
            response(403, "Invalid token provided. Try signing up again.");
        }

        if (magicLink.account_created) {
            response(403, "Token has been expired. Try signing up again.");
        }

        if (new Date() > new Date(magicLink.expiresAt)) {
            response(403, "Token has been expired. Try signing up again.");
        }

        const username = await generateUsername(email);
        const userObj = new User({
            personal_info: {
                fullname,
                email,
                username,
            },
        });

        await userObj.save();
        magicLink.used = true;
        magicLink.account_created = true;
        await magicLink.save();

        const access_token = jwt.sign({ id: userObj._id }, process.env.SECRET_ACCESS_KEY);

        const user = {
            access_token,
            profile_img: userObj.personal_info.profile_img,
            username: userObj.personal_info.username,
            fullname: userObj.personal_info.fullname,
            email: userObj.personal_info.email,
        };
        await setCookie("user", user);
        return response(200, "User registered successfully", { user });
    } catch (error) {
        return response(500, "Internal Server Error", { error: error.message });
    }
}

export const POST = applyMiddlewares(withDB)(handler);

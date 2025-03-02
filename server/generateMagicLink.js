"use server";
import crypto from "crypto";
import MagicLink from "../../models/MagicLink.js";
import { connectToDB } from "lib/mongodb.js";
import User from "@/models/User.js";
// import sendEmail from "@/utils/sendEmail";

export async function generateMagicLink(email, mode) {
    await connectToDB();

    const isUserExists = await userExists(email);
    if (mode == "signin") {
        if (!isUserExists) {
            return { success: false, message: "Sorry, we didn't recognize that email." };
        }
    } else {
        if (isUserExists) {
            return {
                success: false,
                message: "Sorry, this email is already registered, sign in instead.",
            };
        }
    }
    const token = crypto.randomBytes(16).toString("hex");
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const magicLink = new MagicLink({ email, token, code, expiresAt });
    await magicLink.save();

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/b/callback/email?token=${token}&mode=${mode}`;

    // await sendEmail(email, "Your Magic Login Link", `Click here to login: ${link}`);
    console.log(`Magic Link: ${link}`);
    console.log(`Verification Code: ${code}`);
    return { success: true, message: "Magic link sent to your email!" };
}

async function userExists(email) {
    const user = await User.findOne({ "personal_info.email": email });
    return !!user;
}

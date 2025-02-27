import bcrypt from "bcrypt";
import User from "@/models/User";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { withDB } from "@/middleware/withDB";
import { withAuth } from "@/middleware/withAuth";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return response(
                403,
                "Current password and new password are required"
            );
        }

        const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
        if (
            !passwordRegex.test(newPassword) ||
            !passwordRegex.test(currentPassword)
        ) {
            return response(
                403,
                "Password must be at least 6 characters long, contain at least one uppercase letter, one lowercase letter, and one number"
            );
        }

        const user = await User.findById(req.user);

        if (!user) {
            return response(404, "User not found");
        }

        if (user.google_auth) {
            return response(
                403,
                "You can't change the password because you logged in through Google"
            );
        }

        const match = await bcrypt.compare(
            currentPassword,
            user.personal_info.password
        );
        if (!match) {
            return response(403, "Incorrect password");
        }

        user.personal_info.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        return response(200, "Password changed successfully");
    } catch (error) {
        return response(500, "Internal Server Error", { error: error.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

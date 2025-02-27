import { withAuth } from "@/middleware/withAuth";
import { withDB } from "@/middleware/withDB";
import User from "@/models/User";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import { response } from "@/utils/response";

async function handler(req) {
    try {
        const { username, bio, social_links } = await req.json();
        const bioLimit = 150;

        if (username.length < 3) {
            return response(403, "Username must be at least 3 characters");
        }

        if (bio.length > bioLimit) {
            return response(403, `Bio must be ${bioLimit} characters or less`);
        }

        try {
            const socialLinksArr = Object.keys(social_links);
            for (let i = 0; i < socialLinksArr.length; i++) {
                if (social_links[socialLinksArr[i]].length) {
                    const hostname = new URL(social_links[socialLinksArr[i]]).hostname;

                    if (
                        !hostname.includes(`${socialLinksArr[i]}.com`) &&
                        socialLinksArr[i] !== "website"
                    ) {
                        return response(
                            403,
                            `${socialLinksArr[i]} link is invalid. You must enter a full link.`
                        );
                    }
                }
            }
        } catch {
            return response(403, "You must provide full social links with http(s) included");
        }

        const updateObj = {
            "personal_info.username": username,
            "personal_info.bio": bio,
            social_links,
        };

        await User.findByIdAndUpdate(req.user, updateObj, {
            runValidators: true,
        });
        return response(200, "success", { username });
    } catch (err) {
        if (err.code === 11000) {
            return response(403, "Username already exists");
        }
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

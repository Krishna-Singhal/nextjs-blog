import { response } from "@/utils/response";
import { withAuth } from "@/middleware/withAuth";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import Blog from "@/models/Blog";
import User from "@/models/User";
import { customAlphabet } from "nanoid";
import { withDB } from "@/middleware/withDB";
import Tag from "@/models/Tag";
import slugify from "slugify";

const nanoid = customAlphabet("0123456789", 6);

async function handler(req) {
    try {
        const { title, des, banner, content, tags = [], draft, slug: blogslug } = await req.json();
        console.log(tags);
        const user_id = req.user;

        if (!title || !title.length) {
            return response(403, "You must provide a Blog Title");
        }

        if (!draft) {
            if (!des.length || des.length > 200) {
                return response(
                    403,
                    "You must provide a blog description with a maximum of 200 characters."
                );
            }
            if (!banner || !banner.length) {
                return response(403, "You must provide a blog banner to publish the blog.");
            }
            if (!content || !content.blocks.length) {
                return response(403, "You must provide blog content to publish the blog.");
            }
            if (!tags || !tags.length || tags.length > 10) {
                return response(403, "You must provide blog tags with a maximum of 10 tags.");
            }
        }

        const tagsObj = await Tag.find({
            name: { $in: tags.map((tag) => tag.trim().toLowerCase()) },
        });
        const tagNames = tagsObj.map((tag) => tag.name.trim().toLowerCase());

        const newTagNames = tags
            .map((tag) => tag.trim().toLowerCase())
            .filter((name) => !tagNames.includes(name));

        const newTags =
            newTagNames.length > 0
                ? await Tag.insertMany(newTagNames.map((name) => ({ name, slug: slugify(name) })))
                : [];

        const formattedTags = [...tagsObj, ...newTags].map((tag) => tag._id);

        const slug = blogslug || slugify(title) + "-" + nanoid();

        if (blogslug) {
            const blog = await Blog.findOneAndUpdate(
                { slug: blogslug },
                {
                    $set: {
                        title,
                        des,
                        banner,
                        content,
                        tags: formattedTags,
                        draft: Boolean(draft),
                    },
                },
                { new: true }
            );

            if (!blog) return response(404, "Blog not found");
            return response(200, "Blog updated successfully");
        } else {
            const newBlog = new Blog({
                title,
                des,
                banner,
                content,
                tags: formattedTags,
                author: user_id,
                slug,
                draft: Boolean(draft),
            });

            await newBlog.save();
            if (!draft) {
                await User.findOneAndUpdate(
                    { _id: user_id },
                    {
                        $inc: { "account_info.total_posts": 1 },
                    }
                );
            }

            return response(200, "Blog posted successfully", { slug });
        }
    } catch (err) {
        console.error(err);
        return response(500, "Internal server error", { error: err.message });
    }
}

export const POST = applyMiddlewares(withAuth, withDB)(handler);

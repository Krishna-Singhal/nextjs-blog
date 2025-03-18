import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import Blog from "@/models/Blog";
import Tag from "@/models/Tag";
import { withDB } from "@/middleware/withDB";

async function handler(req) {
    try {
        const topTags = await Blog.aggregate([
            { $unwind: "$tags" },
            {
                $group: {
                    _id: "$tags",
                    totalReads: { $sum: "$activity.total_reads" },
                },
            },
            { $sort: { totalReads: -1 } },
            { $limit: 15 },
        ]);

        const tagIds = topTags.map((tag) => tag._id);

        const tags = await Tag.find({ _id: { $in: tagIds } }).select("name slug -_id");

        return response(200, "success", { tags });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

import { response } from "@/utils/response";
import { applyMiddlewares } from "@/utils/applyMiddlewares";
import Tag from "@/models/Tag";
import { withDB } from "@/middleware/withDB";

async function handler(req) {
    try {
        const query = req.nextUrl.searchParams.get("query");
        if (!query || !query.length) {
            return response(400, "Search query is required.");
        }

        const tags = await Tag.find({ name: { $regex: query, $options: "i" } })
            .limit(10)
            .select("name -_id");

        return response(200, "success", { suggestions: tags.map((tag) => tag.name) });
    } catch (err) {
        console.error(err);
        return response(500, "Internal Server Error", { error: err.message });
    }
}

export const GET = applyMiddlewares(withDB)(handler);

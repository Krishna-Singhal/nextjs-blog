import { generateUploadURL } from "@/lib/aws";
import { response } from "@/utils/response";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get("fileName");
    const fileType = searchParams.get("fileType");

    if (!fileName || !fileType) {
        return response(400, "File name and type are required");
    }

    try {
        const uploadUrl = await generateUploadURL(fileName, fileType);
        return response(200, "success", { uploadUrl });
    } catch (error) {
        console.error(error.message);
        return response(500, error.message);
    }
}

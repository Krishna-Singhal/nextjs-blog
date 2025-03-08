import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";

const s3 = new S3Client({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export const generateUploadURL = async (folderName, fileName, fileType) => {
    const date = new Date();
    const parts = fileName.split(".");

    if (parts.length === 1) {
        parts.push("jpg");
    }

    const extension = parts.pop();
    const name = parts.join(".");

    if (!fileType || !fileType.startsWith("image/")) {
        fileType = "image/jpeg";
    }

    const imgName = `${name}-${nanoid()}-${date.getTime()}.${extension}`;
    const key = `${folderName}/${imgName}`;

    try {
        const command = new PutObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: key,
            ContentType: fileType,
        });

        const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 1000 });

        return uploadUrl;
    } catch (error) {
        console.error("Error generating upload URL:", error);
        return null;
    }
};

import aws from "aws-sdk";
import { nanoid } from "nanoid";

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "eu-north-1",
});

export const generateUploadURL = async (fileName, fileType) => {
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

  try {
    const uploadUrl = await s3.getSignedUrlPromise("putObject", {
      Bucket: "blogging-website-mern-123",
      Key: imgName,
      Expires: 1000,
      ContentType: fileType,
    });

    return uploadUrl;
  } catch (error) {
    console.error("Error generating upload URL:", error);
    return null;
  }
};

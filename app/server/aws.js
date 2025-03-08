"use server";
import { generateUploadURL } from "@/lib/aws";

export const uploadImage = async (folder, img) => {
    let uploadURL, imgURL;
    try {
        uploadURL = await generateUploadURL(folder, img.name, img.type);
        if (!uploadURL) {
            return;
        }
    } catch (error) {
        console.error(error.message);
        return;
    }
    let uploadres = await fetch(uploadURL, {
        method: "PUT",
        headers: { "Content-Type": "multipart/formdata" },
        body: img,
    });
    if (uploadres.ok) {
        imgURL = uploadURL.split("?")[0];
    }
    return imgURL;
};

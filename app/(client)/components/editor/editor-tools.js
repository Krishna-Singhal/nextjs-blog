export const getEditorTools = async () => {
    if (typeof window === "undefined") return null;

    const { default: Embed } = await import("@editorjs/embed");
    const { default: List } = await import("@editorjs/list");
    const { default: Image } = await import("@editorjs/image");
    const { default: Header } = await import("@editorjs/header");
    const { default: Quote } = await import("@editorjs/quote");
    const { default: Marker } = await import("@editorjs/marker");
    const { default: InlineCode } = await import("@editorjs/inline-code");
    const { uploadImage } = await import("@/app/server/aws");

    const uploadImageByUrl = async (url) => {
        return {
            success: 1,
            file: { url },
        };
    };

    const uploadImageByFile = (e) => {
        return uploadImage("blog-images", e).then((url) => {
            if (url) {
                return { success: 1, file: { url } };
            }
        });
    };

    return {
        header: {
            class: Header,
            config: {
                placeholder: "Type Heading...",
                levels: [2, 3],
                defaultLevel: 2,
            },
        },
        list: {
            class: List,
            inlineToolbar: true,
        },
        image: {
            class: Image,
            config: {
                uploader: {
                    uploadByUrl: uploadImageByUrl,
                    uploadByFile: uploadImageByFile,
                },
            },
        },
        quote: {
            class: Quote,
            inlineToolbar: true,
        },
        marker: Marker,
        inlineCode: InlineCode,
        embed: Embed,
    };
};

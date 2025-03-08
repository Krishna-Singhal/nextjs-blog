"use client";

import Image from "next/image";
import Link from "next/link";
import AnimationWrapper from "@common/page-animation";
import { uploadImage } from "@/app/server/aws";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useEditor } from "@context/EditorContext";
import { getEditorTools } from "@components/editor/editor-tools";
import { useRouter } from "next/navigation";
import { useUser } from "@context/UserContext";

const BlogEditor = () => {
    const {
        blog,
        blog: { title, banner, des, content, tags },
        setBlog,
        textEditor,
        setTextEditor,
        setEditorState,
        handleNoEnter,
    } = useEditor();

    const [EditorJS, setEditorJS] = useState(null);
    const [tools, setTools] = useState(null);
    const [imgSrc, setImgSrc] = useState(banner || "/imgs/blog banner.png");

    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        const loadEditorJS = async () => {
            const { default: Editor } = await import("@editorjs/editorjs");
            setEditorJS(() => Editor);

            const loadedTools = await getEditorTools();
            setTools(loadedTools);
        };

        loadEditorJS();
    }, []);

    useEffect(() => {
        if (!EditorJS || !tools) return;

        if (!textEditor.isReady) {
            setTextEditor(
                new EditorJS({
                    holder: "textEditor",
                    data: content,
                    tools,
                    placeholder: "Let's write an awesome story",
                })
            );
        }

        // document.addEventListener("paste", (event) => {
        //     const clipboardData = event.clipboardData || window.clipboardData;
        //     const pastedText = clipboardData.getData("text");

        //     console.log("Detected Image URL:", pastedText);
        //     editor.blocks.insert("image", { file: { url: pastedText } });
        // });
    }, [EditorJS, tools]);

    const handleBannerUpload = (e) => {
        let img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...");
            uploadImage("blog-images", img)
                .then((url) => {
                    if (url) {
                        toast.dismiss(loadingToast);
                        toast.success("Uploaded.");
                        setBlog({ ...blog, banner: url });
                        setImgSrc(url);
                    }
                })
                .catch((error) => {
                    toast.dismiss(loadingToast);
                    toast.error(error.message);
                });
        }
    };

    const handleTitleChange = (e) => {
        let titleInput = e.target;
        titleInput.style.height = "auto";
        titleInput.style.height = `${titleInput.scrollHeight}px`;

        setBlog({ ...blog, title: titleInput.value });
    };

    const handleBannerError = (e) => {
        toast.error("Failed to load banner image.");
        setImgSrc("/imgs/blog banner.png");
    };

    const handlePublishEvent = () => {
        if (!banner.length) {
            return toast.error("You must provide a blog banner to publish the blog.");
        }

        if (!title.length) {
            return toast.error("You must provide a blog title.");
        }

        if (textEditor.isReady) {
            textEditor.save().then((outputData) => {
                if (outputData.blocks.length) {
                    setBlog({ ...blog, content: outputData });
                    setEditorState("publish");
                } else {
                    toast.error("Write something in blog to publish blog.");
                }
            });
        }
    };

    const handleSaveDraft = (e) => {
        if (!title.length) {
            return toast.error("You must provide a blog title to save the draft.");
        }

        if (textEditor.isReady) {
            textEditor.save().then(async (content) => {
                let loadingToast = toast.loading("Saving Draft...");
                e.target.disabled = true;

                try {
                    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/post`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${user.access_token}`,
                        },
                        body: JSON.stringify({ title, banner, des, content, tags, draft: true }),
                    });

                    const data = await res.json();
                    e.target.disabled = false;
                    toast.dismiss(loadingToast);
                    if (res.ok) {
                        toast.success("Blog draft saved.");
                        setTimeout(() => {
                            router.push("/");
                        }, 500);
                    } else {
                        toast.error(data.message);
                    }
                } catch (error) {
                    e.target.disabled = false;
                    toast.dismiss(loadingToast);
                    toast.error(error.message);
                }
            });
        }
    };

    return (
        <>
            <nav className="navbar">
                <Link href="/" className="flex-none w-10">
                    <Image
                        src="/imgs/logo.png"
                        alt="Logo"
                        width={35}
                        height={44}
                        className="w-full object-cover"
                    />
                </Link>
                <p className="hidden md:block text-black line-clamp-1 w-full">
                    {title.length ? title : "New Blog"}
                </p>
                <div className="flex gap-4 ml-auto">
                    <button onClick={handlePublishEvent} className="btn-dark text-base">
                        Publish
                    </button>
                    <button className="btn-light text-base" onClick={handleSaveDraft}>
                        Save Draft
                    </button>
                </div>
            </nav>

            <AnimationWrapper>
                <section>
                    <div className="mx-auto max-w-[800px] w-full">
                        <div className="relative aspect-video bg-white border-2 border-grey hover:opacity-80 rounded-lg">
                            <label htmlFor="uploadBanner" className="cursor-pointer">
                                <Image
                                    src={imgSrc}
                                    onError={handleBannerError}
                                    alt={`${title.length ? title : "New Blog"} Banner`}
                                    width={0}
                                    height={0}
                                    className="w-full z-20 rounded-lg object-fill"
                                    sizes="100vw"
                                />
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept="images/*"
                                    hidden
                                    onChange={handleBannerUpload}
                                />
                            </label>
                        </div>

                        <textarea
                            defaultValue={title}
                            placeholder="Blog Title"
                            className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                            onKeyDown={handleNoEnter}
                            onChange={handleTitleChange}
                        ></textarea>

                        <hr className="w-full opacity-10 my-5" />

                        <div id="textEditor" className="font-gelasio"></div>
                    </div>
                </section>
            </AnimationWrapper>
        </>
    );
};

export default BlogEditor;

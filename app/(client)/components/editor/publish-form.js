import React from "react";
import AnimationWrapper from "@common/page-animation";
import { useEditor } from "@context/EditorContext";
import Image from "next/image";
import Topic from "@components/editor/Topic";
import toast from "react-hot-toast";
import { useUser } from "@context/UserContext";
import { useRouter } from "next/navigation";
import SuggestionInput from "@components/ui/SuggestionInput ";

const PublishForm = () => {
    let characterLimit = 200;
    let tagsLimit = 10;
    const { user } = useUser();
    const router = useRouter();

    const {
        blog,
        blog: { title, banner, content, des, tags },
        setBlog,
        setEditorState,
        handleNoEnter,
    } = useEditor();

    const handleBlogTitleChange = (e) => {
        setBlog({ ...blog, title: e.target.value });
    };

    const handleDesChange = (e) => {
        setBlog({ ...blog, des: e.target.value });
    };

    const fetchTags = async (query) => {
        const res = await fetch(`/api/tags/suggest?query=${encodeURIComponent(query)}`);

        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const data = await res.json();
        return data.suggestions || [];
    };

    const handleAddTagEvent = (newTag) => {
        if (tags.length < tagsLimit) {
            if (!tags.includes(newTag)) {
                setBlog({ ...blog, tags: [...tags, newTag] });
            }
        } else {
            toast.error(`You can only add up to ${tagsLimit} tags`);
        }
    };

    const publishBlog = async (e) => {
        if (!title.length) {
            return toast.error("You must provide a blog title to publish the blog.");
        }

        if (!des.length || des.length > characterLimit) {
            return toast.error(
                `Blog description must be provided and should not exceed ${characterLimit} characters.`
            );
        }

        if (!banner.length) {
            return toast.error("You must provide a blog banner to publish the blog.");
        }

        if (!tags || !tags.length || tags.length > 10) {
            return toast.error("You must provide blog tags with a maximum of 10 tags.");
        }

        let loadingToast = toast.loading("Publishing...");
        e.target.disabled = true;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/post`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.access_token}`,
                },
                body: JSON.stringify({ title, banner, des, content, tags, draft: false }),
            });

            const data = await res.json();
            e.target.disabled = false;
            toast.dismiss(loadingToast);
            if (res.ok) {
                toast.success("Blog Published.");
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
    };

    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <button
                    className="w-12 h-12 absolute right-[2vw] z-10 top-[2%] lg:top-[5%] lg:right-[4vw]"
                    onClick={() => {
                        setEditorState("editor");
                    }}
                >
                    <i className="fi fi-br-cross"></i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-5">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <Image
                            src={banner}
                            alt={`${title.length ? title : "New Blog"} Banner`}
                            width={0}
                            height={0}
                            className="w-full z-20 rounded-lg object-fill"
                            sizes="100vw"
                        />
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
                        {title}
                    </h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{des}</p>
                </div>

                <div className="">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input
                        className="input-box pl-4"
                        type="text"
                        placeholder="Blog Title"
                        defaultValue={title}
                        onChange={handleBlogTitleChange}
                    />

                    <p className="text-dark-grey mb-2 mt-9">Short Description about your blog</p>
                    <textarea
                        className="input-box h-40 resize-none leading-7 pl-4"
                        maxLength={characterLimit}
                        defaultValue={des}
                        onChange={handleDesChange}
                        onKeyDown={handleNoEnter}
                    ></textarea>

                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {characterLimit - des.length} characters left
                    </p>

                    <p className="text-dark-grey mb-2 mt-9">
                        Topics - (Helps us search and rank your blog post.)
                    </p>
                    <div className="input-box pl-2 py-2 pb-4">
                        <SuggestionInput
                            placeholder="Add topics..."
                            fetchSuggestions={fetchTags}
                            onSelect={handleAddTagEvent}
                            allowCustomInput={true}
                            containerProps={{ className: "" }}
                            InputProps={{
                                className:
                                    "sticky bg-white top-0 left-0 p-2 pl-4 mb-2 mt-1 focus:bg-white",
                            }}
                            debounceTimeout={400}
                        />
                        <div>
                            {tags.map((tag, i) => (
                                <Topic key={i} topicIndex={i} topic={tag} />
                            ))}
                        </div>
                    </div>
                    <p className="mt-1 mb-4 text-dark-grey text-sm text-right">
                        {tagsLimit - tags.length} Tags left
                    </p>

                    <button className="btn-dark px-8" onClick={publishBlog}>
                        Publish
                    </button>
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default PublishForm;

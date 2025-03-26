"use client";

import BlogEditor from "@components/editor/blog-editor";
import PublishForm from "@components/editor/publish-form";
import { useEditor } from "@context/EditorContext";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const EditBlogPage = () => {
    const { blog, setBlog, editorState } = useEditor();
    const { slug } = useParams();
    const router = useRouter();

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/blog/get?slug=${slug}&mode=edit&draft=true`
                );
                if (!res.ok) throw new Error("Blog not found");

                const data = await res.json();
                if (!data.blog || Object.keys(data.blog).length === 0) {
                    throw new Error("Empty blog data");
                }
                setBlog({ ...data.blog, tags: data.blog.tags.map((tag) => tag.name) });
            } catch (error) {
                router.replace("/404");
            }
        };
        fetchBlog();
    }, [slug]);

    return editorState == "editor" ? <BlogEditor /> : <PublishForm />;
};

export default EditBlogPage;

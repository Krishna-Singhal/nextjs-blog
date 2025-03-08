"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@context/UserContext";
import BlogEditor from "@components/editor/blog-editor";
import PublishForm from "@components/editor/publish-form";
import { useEditor } from "@context/EditorContext";

const EditorPage = () => {
    const { user } = useUser();
    const router = useRouter();
    const { editorState } = useEditor();

    useEffect(() => {
        if (!user.access_token) {
            router.push("/m/signin");
        }
    }, [user, router]);

    return user.access_token && (editorState == "editor" ? <BlogEditor /> : <PublishForm />);
};

export default EditorPage;

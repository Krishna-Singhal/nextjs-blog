"use client";

import BlogEditor from "@components/editor/blog-editor";
import PublishForm from "@components/editor/publish-form";
import { useEditor } from "@context/EditorContext";

const EditorPage = () => {
    const { editorState } = useEditor();

    return editorState == "editor" ? <BlogEditor /> : <PublishForm />;
};

export default EditorPage;

"use client";

import { createContext, useContext, useState } from "react";

const blogStructure = {
    title: "",
    banner: "",
    des: "",
    content: [],
    tags: [],
    author: { perosnal_info: {} },
};

const EditorContext = createContext({});

export const EditorProvider = ({ children }) => {
    const [blog, setBlog] = useState(blogStructure);
    const [editorState, setEditorState] = useState("editor");
    const [textEditor, setTextEditor] = useState({ isReady: false });

    const handleNoEnter = (e) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    return (
        <EditorContext.Provider
            value={{
                blog,
                setBlog,
                editorState,
                setEditorState,
                handleNoEnter,
                textEditor,
                setTextEditor,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => useContext(EditorContext);

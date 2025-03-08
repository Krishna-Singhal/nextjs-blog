import React from "react";
import { useEditor } from "../../context/EditorContext";

const Topic = ({ topic, topicIndex }) => {
    let {
        blog,
        blog: { tags },
        setBlog,
    } = useEditor();

    const handleTopicDelete = () => {
        tags = tags.filter((tag) => tag !== topic);
        setBlog({ ...blog, tags });
    };

    const handleInlineEdit = (e) => {
        if (e.keyCode == 13 || e.keyCode == 188) {
            e.preventDefault();
            let tag = e.target.innerText;
            tags[topicIndex] = tag;
            setBlog({ ...blog, tags });
            e.target.contentEditable = false;
        }
    };

    return (
        <div className="inline-flex justify-center items-center gap-1 mt-2 mr-2 bg-white rounded-2xl px-3 border border-black border-opacity-15 text-black text-opacity-55 leading-8 font-medium">
            <span
                className="outline-none text-sm"
                onKeyDown={handleInlineEdit}
                onClick={(e) => {
                    e.target.contentEditable = true;
                    e.target.focus();
                }}
            >
                {topic}
            </span>
            <button className="text-xl" onClick={handleTopicDelete}>
                ×
            </button>
        </div>
    );
};

export default Topic;

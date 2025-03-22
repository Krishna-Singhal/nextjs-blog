"use client";

import { createContext, useContext, useState } from "react";

const blogStructure = {
    title: "",
    des: "",
    banner: "",
    content: [],
    author: { personal_info: {} },
    tags: [],
    publishedAt: "",
};

const BlogContext = createContext({});

export const BlogProvider = ({ children, slug, loadedBlog, loadedSimilarBlogs }) => {
    const [blog, setBlog] = useState(loadedBlog || null);
    const [similarBlogs, setSimilarBlogs] = useState(loadedSimilarBlogs || null);
    const [isLiked, setIsLiked] = useState(false);

    return (
        <BlogContext.Provider
            value={{
                blog,
                blogStructure,
                setBlog,
                similarBlogs,
                setSimilarBlogs,
                isLiked,
                setIsLiked,
                slug,
            }}
        >
            {children}
        </BlogContext.Provider>
    );
};

export const useBlog = () => useContext(BlogContext);

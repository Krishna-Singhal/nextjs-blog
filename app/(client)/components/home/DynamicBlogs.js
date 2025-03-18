"use client";

import dynamic from "next/dynamic";

const Blogs = dynamic(() => import("@components/home/Blogs"), { ssr: false });

export default function DynamicBlogs(props) {
    return <Blogs {...props} />;
}

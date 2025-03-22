"use client";

import dynamic from "next/dynamic";

const TrendingBlogs = dynamic(() => import("@components/home/TrendingBlogs"), { ssr: false });

export default function DynamicTrendingBlogs(props) {
    return <TrendingBlogs {...props} />;
}

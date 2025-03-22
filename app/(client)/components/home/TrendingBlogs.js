"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { timeAgo } from "@common/functions";
import AnimationWrapper from "@common/page-animation";
import NoDataMessage from "@components/ui/no-data";
import ProfileImage from "@components/ui/ProfileImage";

const TrendingBlogCard = ({ blog, index }) => {
    let {
        title,
        slug,
        author: {
            personal_info: { fullname, username, profile_img },
        },
        publishedAt,
    } = blog;

    return (
        <Link href={`/blog/${slug}`} className="flex gap-5 mb-5">
            <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : index}</h1>

            <div>
                <div className="flex gap-2 items-center mb-2">
                    <div className="max-w-min max-h-min min-w-5 min-h-5 sm:min-w-6 sm:min-h-6">
                        <ProfileImage src={profile_img} alt={fullname} />
                    </div>
                    <p className="line-clamp-1">{fullname}</p>
                </div>
                <h1 className="blog-title mb-3 text-xl">{title}</h1>
                <p className="min-w-fit">{timeAgo(publishedAt)}</p>
            </div>
        </Link>
    );
};

const TrendingBlogs = ({ trendingBlogs }) => {
    const { data: trendingBlogsData, isLoading: trendingBlogsLoading } = useQuery({
        queryKey: ["trendingBlogs"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/trending`, {
                cache: "force-cache",
                next: { revalidate: 3600 },
            });
            if (!res.ok) throw new Error("Failed to fetch tabs");
            const data = await res.json();
            return data.blogs;
        },
        initialData: trendingBlogs && trendingBlogs.length ? trendingBlogs : undefined,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            <h1 className="font-medium text-xl mb-8">
                Trending <i className="fi fi-rr-arrow-trend-up"></i>
            </h1>
            {trendingBlogsLoading ? (
                "Loading..."
            ) : trendingBlogsData?.length ? (
                trendingBlogsData.map((blog, i) => {
                    return (
                        <AnimationWrapper transition={{ duration: 1, delay: i * 0.1 }} key={i}>
                            <TrendingBlogCard blog={blog} index={i} />
                        </AnimationWrapper>
                    );
                })
            ) : (
                <NoDataMessage message="No Blogs Published!" />
            )}
        </>
    );
};

export default TrendingBlogs;

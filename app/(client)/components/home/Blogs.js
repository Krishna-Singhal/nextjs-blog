"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NavigationTabs from "@components/ui/NavigationTabs";
import AnimationWrapper from "@common/page-animation";
import BlogCard from "@components/home/BlogCard";
import NoDataMessage from "../ui/no-data";

const PAGE_SIZE = 10;

async function fetchBlogs({ pageParam = 1, queryKey }) {
    const [, tab] = queryKey;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/trending?page=${pageParam}&tag=${tab}`,
        { cache: "force-cache", next: { revalidate: 300 } }
    );
    if (!res.ok) {
        throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    return {
        blogs: data.blogs,
        nextPage: pageParam + 1,
        isLast: data.blogs.length < PAGE_SIZE,
    };
}

export default function Blogs({ tabsArray, initialBlogs, defaultTab }) {
    const [tab, setTab] = useState(defaultTab || tabsArray?.length ? tabsArray[0]?.id : "for-you");

    const { data: tabs, isLoading: tabsLoading } = useQuery({
        queryKey: ["tabs"],
        queryFn: async () => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/trending`, {
                cache: "force-cache",
                next: { revalidate: 3600 },
            });
            if (!res.ok) throw new Error("Failed to fetch tabs");
            const data = await res.json();
            return [
                { name: "for you", id: "for-you" },
                ...data.tags.map((tag) => ({ name: tag.name, id: tag.slug })),
            ];
        },
        initialData: tabsArray && tabsArray.length ? tabsArray : undefined,
        staleTime: 1000 * 60 * 5,
    });

    const infiniteQueryInitialData =
        initialBlogs && initialBlogs.length
            ? {
                  pages: [
                      {
                          blogs: initialBlogs,
                          nextPage: 2,
                          isLast: initialBlogs.length < PAGE_SIZE,
                      },
                  ],
                  pageParams: [1],
              }
            : undefined;

    const {
        data: blogsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["blogs", tab],
        queryFn: fetchBlogs,
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        initialData: infiniteQueryInitialData,
    });

    const blogs = blogsData ? blogsData.pages.flatMap((page) => page.blogs) : [];

    const observer = useRef(null);
    const lastBlogElementRef = useCallback(
        (node) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage]
    );

    const containerRef = useRef(null);
    useEffect(() => {
        const checkContainerHeight = () => {
            if (
                containerRef.current &&
                containerRef.current.offsetHeight < window.innerHeight &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        };
        checkContainerHeight();
        window.addEventListener("resize", checkContainerHeight);
        return () => window.removeEventListener("resize", checkContainerHeight);
    }, [blogs, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div ref={containerRef}>
            <NavigationTabs
                tab={tab}
                setTab={setTab}
                tabs={tabs ?? []}
                showSkeleton={tabsLoading}
            />

            {status === "pending" ? (
                <p>Loading skeleton...</p>
            ) : status === "error" ? (
                <p>Error loading blogs: {error.message}</p>
            ) : blogs?.length ? (
                <div className="blogs-list">
                    {blogs.map((blog, index) => {
                        return (
                            <AnimationWrapper
                                key={index}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                ref={index == blogs.length - 1 ? lastBlogElementRef : null}
                            >
                                <BlogCard blog={blog} />
                            </AnimationWrapper>
                        );
                    })}
                </div>
            ) : (
                <NoDataMessage message="No blogs published!" />
            )}

            {isFetchingNextPage && <p>Loading more blogs...</p>}
            {!hasNextPage && blogsData?.pages?.length > 2 && status !== "pending" && (
                <p>No more blogs available.</p>
            )}
        </div>
    );
}

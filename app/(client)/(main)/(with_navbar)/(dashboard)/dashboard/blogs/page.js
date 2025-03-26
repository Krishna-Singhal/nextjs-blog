"use client";

import React, { useState, useRef, useCallback } from "react";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import NavigationTabs from "@components/ui/NavigationTabs";
import AnimationWrapper from "@common/page-animation";
import NoDataMessage from "@components/ui/no-data";
import { useUser } from "@context/UserContext";
import toast from "react-hot-toast";
import { ManageDraftBlogCard, ManagePublishedBlogCard } from "@components/dashboard/ManageBlogCard";
import { useSearchParams } from "next/navigation";

const PAGE_SIZE = 10;

async function fetchBlogs({ pageParam = 1, queryKey }) {
    const [, query, draft, access_token] = queryKey;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/me`, {
        headers: { Authorization: "Bearer " + access_token },
        method: "POST",
        body: JSON.stringify({ page: pageParam, query, draft }),
    });
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

const BlogsManagementPage = () => {
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [tab, setTab] = useState(searchParams.get("tab") || "published-blogs");

    const tabs = [
        { id: "published-blogs", name: "Published Blogs" },
        { id: "drafts", name: "Drafts" },
    ];
    const queryClient = useQueryClient();
    const { user } = useUser();
    let isDraft = tab == "drafts";

    const {
        data: blogsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["manage-blogs", query, isDraft, user.access_token],
        queryFn: fetchBlogs,
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
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

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSearch = (e) => {
        let searchQuery = e.target.value;
        setQuery(searchQuery);

        if (e.keyCode == 13 && searchQuery.length) {
        }
    };

    const deleteBlogMutation = useMutation({
        mutationFn: async (slug) => {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/delete`, {
                method: "POST",
                headers: { Authorization: "Bearer " + user.access_token },
                body: JSON.stringify({ slug }),
            });
            if (!res.ok) {
                throw new Error("Failed to delete blog");
            }
            return slug;
        },
        onSuccess: (slug) => {
            toast.success("Blog has been deleted.");
            queryClient.setQueryData(
                ["manage-blogs", query, isDraft, user.access_token],
                (oldData) => {
                    if (!oldData) return oldData;
                    return {
                        ...oldData,
                        pages: oldData.pages.map((page) => ({
                            ...page,
                            blogs: page.blogs.filter((blog) => blog.slug !== slug),
                        })),
                    };
                }
            );
        },
    });

    const handleDelete = (slug) => {
        deleteBlogMutation.mutate(slug);
    };

    return (
        <>
            <h1 className="hidden md:block text-2xl">Manage Blogs</h1>
            <div className="relative mt-5 md:mt-8 mb-10">
                <input
                    type="search"
                    className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-dark-grey"
                    placeholder="Search Blogs"
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>

            <NavigationTabs tab={tab} setTab={setTab} tabs={tabs} />
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
                                transition={{ duration: 1, delay: index * 0.04 }}
                            >
                                {isDraft ? (
                                    <ManageDraftBlogCard
                                        blog={blog}
                                        index={index + 1}
                                        onDelete={handleDelete}
                                        ref={index == blogs.length - 1 ? lastBlogElementRef : null}
                                    />
                                ) : (
                                    <ManagePublishedBlogCard
                                        blog={blog}
                                        onDelete={handleDelete}
                                        ref={index == blogs.length - 1 ? lastBlogElementRef : null}
                                    />
                                )}
                            </AnimationWrapper>
                        );
                    })}
                </div>
            ) : (
                <NoDataMessage message="No blogs found!" />
            )}

            {isFetchingNextPage && <p>Loading more blogs...</p>}
            {!hasNextPage && blogsData?.pages?.length > 2 && status !== "pending" && (
                <p>No more blogs available.</p>
            )}
        </>
    );
};

export default BlogsManagementPage;

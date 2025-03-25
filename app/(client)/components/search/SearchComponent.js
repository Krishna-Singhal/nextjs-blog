"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NavigationTabs from "@components/ui/NavigationTabs";
import AnimationWrapper from "@common/page-animation";
import BlogCard from "@components/home/BlogCard";
import NoDataMessage from "@components/ui/no-data";
import UserCard from "@components/search/UserCard";

const PAGE_SIZE = 10;

async function Search({ pageParam = 1, queryKey }) {
    const [tab, query] = queryKey;
    let url;
    if (tab == "search-blogs") {
        url = `${process.env.NEXT_PUBLIC_API_URL}/blog/search?page=${pageParam}&query=${query}`;
    } else {
        url = `${process.env.NEXT_PUBLIC_API_URL}/profile/search?page=${pageParam}&query=${query}`;
    }
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("Failed to fetch blogs");
    }
    const data = await res.json();
    if (tab == "search-blogs") {
        return {
            data: data.blogs,
            nextPage: pageParam + 1,
            isLast: data.blogs.length < PAGE_SIZE,
        };
    }
    return {
        data: data.profiles,
        nextPage: pageParam + 1,
        isLast: data.profiles.length < PAGE_SIZE,
    };
}

export const BlogSearchResults = ({ query, initialBlogs }) => {
    const [tab, setTab] = useState("search-blogs");

    const infiniteQueryInitialData =
        tab == "search-blogs" && initialBlogs && initialBlogs.length
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
        data: loadedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: [tab, query],
        queryFn: Search,
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        initialData: infiniteQueryInitialData,
    });

    const data = loadedData ? loadedData.pages.flatMap((page) => page.data) : [];

    const observer = useRef(null);
    const lastElementRef = useCallback(
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
    }, [data, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div ref={containerRef}>
            <NavigationTabs
                tab={tab}
                setTab={setTab}
                tabs={[
                    { id: "search-blogs", name: `Search Results from "${query}"` },
                    { id: "search-accounts", name: "Accounts Matched" },
                ]}
                defaultHidden={["search-accounts"]}
                showSkeleton={false}
            />

            {status === "pending" ? (
                tab === "search-blogs" ? (
                    <p>Searching blogs...</p>
                ) : (
                    <p>Searching profiles...</p>
                )
            ) : status === "error" ? (
                <p>
                    Error loading {tab === "search-blogs" ? "blogs" : "profiles"}: {error.message}
                </p>
            ) : data?.length ? (
                tab === "search-blogs" ? (
                    <div className="blogs-list">
                        {data.map((blog, index) => (
                            <AnimationWrapper
                                key={index}
                                transition={{ duration: 1, delay: index * 0.1 }}
                                ref={index === data.length - 1 ? lastElementRef : null}
                            >
                                <BlogCard blog={blog} />
                            </AnimationWrapper>
                        ))}
                    </div>
                ) : (
                    <>
                        {data.map((profile, index) => (
                            <AnimationWrapper
                                key={index}
                                transition={{ duration: 1, delay: index * 0.08 }}
                                ref={index === data.length - 1 ? lastElementRef : null}
                            >
                                <UserCard profile={profile} />
                            </AnimationWrapper>
                        ))}
                    </>
                )
            ) : tab === "search-blogs" ? (
                <NoDataMessage message="No blogs found!" />
            ) : (
                <NoDataMessage message="No profiles found!" />
            )}

            {isFetchingNextPage && (
                <p>Searching more {tab === "search-blogs" ? "blogs" : "profiles"}...</p>
            )}

            {!hasNextPage && data?.length > 2 && status !== "pending" && (
                <p>No more {tab === "search-blogs" ? "blogs" : "profiles"} available.</p>
            )}
        </div>
    );
};

export const ProfileSearchResults = ({ query, initialProfiles }) => {
    const {
        data: profiles,
        status,
        error,
    } = useQuery({
        queryKey: ["profiles", query],
        queryFn: async () => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/profile/search?query=${query}`
            );
            if (!res.ok) throw new Error("Failed to fetch profiles");
            const data = await res.json();
            return data.profiles;
        },
        initialData: initialProfiles || undefined,
        staleTime: 1000 * 60 * 5,
    });

    return (
        <>
            <h1 className="font-medium text-xl mb-8">
                Users related to Search <i className="fi fi-rr-user mt-1 ml-1 text-xl"></i>
            </h1>

            {status === "pending" ? (
                <p>Searching profiles...</p>
            ) : status === "error" ? (
                <p>Error loading profiles: {error.message}</p>
            ) : profiles?.length ? (
                <>
                    {profiles.map((profile, index) => (
                        <AnimationWrapper
                            key={index}
                            transition={{ duration: 1, delay: index * 0.08 }}
                        >
                            <UserCard profile={profile} />
                        </AnimationWrapper>
                    ))}
                </>
            ) : (
                <NoDataMessage message="No profiles found!" />
            )}
        </>
    );
};

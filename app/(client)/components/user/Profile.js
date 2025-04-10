"use client";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AnimationWrapper from "@common/page-animation";
import Link from "next/link";
import { useUser } from "@context/UserContext";
import ProfileImage from "@components/ui/ProfileImage";
import AboutUser from "@components/user/AboutUser";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import NavigationTabs from "@components/ui/NavigationTabs";
import BlogCard from "../home/BlogCard";
import NoDataMessage from "../ui/no-data";

const PAGE_SIZE = 10;

async function fetchUserBlogs({ pageParam = 1, queryKey }) {
    const [, author] = queryKey;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/search?page=${pageParam}&author=${author}`
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

const fetchProfile = async (username) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/get?username=${username}`);

    if (!res.ok) throw new Error("Profile not found");

    const data = await res.json();
    if (!data.profile || Object.keys(data.profile).length === 0) {
        throw new Error("Empty profile data");
    }

    return data.profile;
};

const useProfile = (username, loadedProfile) => {
    return useQuery({
        queryKey: ["profile", username],
        queryFn: () => fetchProfile(username),
        initialData: loadedProfile || undefined,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: false,
    });
};

const profileStructure = {
    personal_info: {
        fullname: "",
        email: "",
        bio: "",
        profile_img: "",
        username: "",
    },
    account_info: {
        total_posts: "",
        total_reads: "",
    },
    social_links: {},
    joinedAt: "",
};

const Profile = ({ initialBlogs, loadedProfile, username }) => {
    const router = useRouter();
    const [tab, setTab] = useState("blogs-published");
    const { user } = useUser();

    const { data: profile, isLoading, error: profileError } = useProfile(username, loadedProfile);

    if (profileError) {
        router.replace("/404");
    }

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
        data: loadedData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["user-blogs", profile?._id],
        queryFn: fetchUserBlogs,
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        initialData: infiniteQueryInitialData,
        enabled: !!profile,
    });

    const blogs = loadedData ? loadedData.pages.flatMap((page) => page.blogs) : [];

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
        [hasNextPage, fetchNextPage]
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

    let {
        personal_info: { fullname, username: profileUsername, bio, profile_img },
        account_info: { total_posts, total_reads },
        social_links,
        joinedAt,
    } = profile || profileStructure;

    return (
        <AnimationWrapper>
            <section className="h-cover md:flex flex-row-reverse items-start gap-5 [1100]:gap-12">
                <div className="flex flex-col items-center md:items-start gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l md:border-grey md:sticky md:top-[100px] md:py-10">
                    {isLoading || profileError ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            <div className="w-48 h-48 md:w-32 md:h-32">
                                <ProfileImage src={profile_img} alt={fullname} />
                            </div>
                            <h1 className="text-2xl capitalize font-medium">{fullname}</h1>
                            <p className="text-xl h-6">@{profileUsername}</p>

                            <p>
                                {total_posts.toLocaleString()} Blogs -{" "}
                                {total_reads.toLocaleString()} Reads
                            </p>

                            <div className="flex gap-4 mt-2">
                                {user?.username == profileUsername && (
                                    <Link
                                        href="/settings/edit-profile"
                                        className="btn-light rounded-md"
                                    >
                                        Edit Profile
                                    </Link>
                                )}
                            </div>

                            <AboutUser
                                className="hidden md:block"
                                bio={bio}
                                social_links={social_links}
                                joinedAt={joinedAt}
                            />
                        </>
                    )}
                </div>

                <div className="mt-12 md:mt-0 w-full">
                    <NavigationTabs
                        tab={tab}
                        setTab={setTab}
                        tabs={[
                            { id: "blogs-published", name: "Blogs Published" },
                            { id: "about", name: "About" },
                        ]}
                        defaultHidden={["about"]}
                    />
                    {tab === "about" ? (
                        <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                    ) : status === "pending" ? (
                        <p>Searching blogs...</p>
                    ) : status === "error" ? (
                        <p>Error loading blogs: {error.message}</p>
                    ) : blogs?.length ? (
                        <div className="blogs-list">
                            {blogs.map((blog, index) => (
                                <AnimationWrapper
                                    key={index}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                    ref={index === blogs.length - 1 ? lastElementRef : null}
                                >
                                    <BlogCard blog={blog} />
                                </AnimationWrapper>
                            ))}
                        </div>
                    ) : (
                        <NoDataMessage message="No blogs found!" />
                    )}

                    {tab !== "about" && isFetchingNextPage && <p>Searching more blogs...</p>}

                    {tab !== "about" &&
                        !hasNextPage &&
                        blogs?.length > 2 &&
                        status !== "pending" && <p>No more blogs available.</p>}
                </div>
            </section>
        </AnimationWrapper>
    );
};

export default Profile;

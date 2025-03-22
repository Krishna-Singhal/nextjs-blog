"use client";

import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@context/UserContext";
import { useBlog } from "@context/BlogContext";

const fetchLikes = async (slug) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/likes?slug=${slug}`);
    if (!res.ok) throw new Error("Failed to fetch likes");
    const data = await res.json();
    return data.likes;
};

const fetchLike = async (access_token, _id) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/isLiked`, {
        method: "POST",
        headers: { Authorization: `Bearer ${access_token}` },
        body: JSON.stringify({
            _id,
        }),
    });
    if (!res.ok) throw new Error("Failed to fetch like data");
    const data = await res.json();
    return !!data.liked;
};

const LikesCount = ({ pills }) => {
    const { user } = useUser();
    let { isLiked, setIsLiked, blog, blogStructure, setBlog } = useBlog();
    let {
        activity: { total_likes },
    } = blog || blogStructure;

    const { data, isLoading, error } = useQuery({
        queryKey: ["likes", blog._id],
        queryFn: () => fetchLikes(blog.slug),
        staleTime: 60000,
        refetchOnWindowFocus: true,
    });

    const { data: isLikedData } = useQuery({
        queryKey: ["isLiked", blog._id],
        queryFn: () => fetchLike(user.access_token, blog._id),
        staleTime: 5000,
        refetchOnWindowFocus: true,
        enabled: !!user?.access_token,
    });

    useEffect(() => {
        if (data) {
            setBlog((prev) => ({
                ...prev,
                activity: { ...prev.activity, total_likes: data },
            }));
        }
    }, [data]);

    useEffect(() => {
        if (isLikedData !== undefined) {
            setIsLiked(isLikedData);
        }
    }, [isLikedData]);

    const handleClick = async () => {
        if (user?.access_token) {
            !isLiked ? total_likes++ : total_likes--;
            setIsLiked((prev) => !prev);
            setBlog((prev) => ({
                ...prev,
                activity: { ...prev.activity, total_likes },
            }));
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity/like`, {
                method: "POST",
                headers: { Authorization: `Bearer ${user.access_token}` },
                body: JSON.stringify({
                    _id: blog._id,
                }),
            });
        }
    };

    if (isLoading)
        return (
            <div className="flex items-center">
                <Skeleton
                    className={
                        pills
                            ? "md:w-10 md:h-6 w-[72px] h-[35px] !rounded-full md:!rounded-lg"
                            : "w-10 h-6"
                    }
                />
            </div>
        );

    return (
        <div
            className={
                (pills
                    ? "border border-grey h-[38px] md:h-auto px-4 md:border-0 md:p-0 rounded-full "
                    : "") + "flex gap-2 items-center justify-center group cursor-pointer"
            }
        >
            <button onClick={handleClick} className="flex items-center justify-center">
                <i
                    className={
                        "fi fi-rr-heart mt-1 text-xl " +
                        (isLiked ? "text-red" : "text-dark-grey group-hover:text-black")
                    }
                ></i>
            </button>
            <p className="text-dark-grey group-hover:text-black">{total_likes}</p>
        </div>
    );
};

export default LikesCount;

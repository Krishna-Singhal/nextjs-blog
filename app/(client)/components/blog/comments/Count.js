import React, { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { useQuery } from "@tanstack/react-query";
import { useBlog } from "@context/BlogContext";

const fetchCommentsCount = async (slug) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/commentsCount?slug=${slug}`);
    if (!res.ok) throw new Error("Failed to fetch Comments Count");
    const data = await res.json();
    return data.comments;
};

const CommentsCount = ({ second }) => {
    const { blog, blogStructure, setBlog, setCommentsWrapper } = useBlog();
    const {
        activity: { total_comments },
    } = blog || blogStructure;

    const { data, isLoading, error } = useQuery({
        queryKey: ["commentsCount", blog.slug],
        queryFn: () => fetchCommentsCount(blog.slug),
        staleTime: 60000,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (data !== undefined) {
            setBlog((prev) => ({
                ...prev,
                activity: { ...prev.activity, total_comments: data },
            }));
        }
    }, [data]);

    const handleClick = () => {
        if (!second) {
            setCommentsWrapper((prev) => !prev);
        }
    };

    if (isLoading)
        return (
            <div className="flex items-center">
                <Skeleton
                    className={
                        !second
                            ? "md:w-10 md:h-6 w-[72px] h-[35px] !rounded-full md:!rounded-lg"
                            : "w-10 h-6"
                    }
                />
            </div>
        );
    return (
        <div
            className={
                (!second
                    ? "border border-grey h-[38px] md:h-auto px-4 md:border-0 md:p-0 rounded-full "
                    : "") + "flex gap-2 items-center justify-center group cursor-pointer"
            }
            onClick={handleClick}
        >
            <button className="flex items-center justify-center">
                <i className="fi fi-rr-comment-dots mt-1 text-xl text-dark-grey group-hover:text-black"></i>
            </button>
            <p className="text-dark-grey group-hover:text-black">{total_comments}</p>
        </div>
    );
};

export default CommentsCount;

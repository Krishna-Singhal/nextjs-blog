"use client";

import Link from "next/link";
import React, { memo } from "react";
import { useUser } from "@context/UserContext";
import LikesCount from "@components/blog/LikesCount";
import CommentsCount from "@components/blog/CommentsCount";
import { useBlog } from "@context/BlogContext";

const BlogInteraction = memo(({ pills = true }) => {
    const { blog, blogStructure, slug } = useBlog();
    const {
        author: {
            personal_info: { username },
        },
    } = blog || blogStructure;
    const { user } = useUser();

    return (
        <div
            className={
                "mt-5 md:mt-10 px-2 py-4" + (pills ? " md:border-t md:border-b border-grey" : "")
            }
        >
            <div
                className={`flex ${
                    pills ? "md:justify-between gap-2 md:gap-6" : "justify-between gap-6"
                }`}
            >
                <div className={`flex ${pills ? "gap-2 md:gap-7" : "gap-7"}`}>
                    <LikesCount pills={pills} />
                    <CommentsCount pills={pills} />
                </div>

                <div className={`flex ${pills ? "gap-2 md:gap-5" : "gap-5"}`}>
                    <div
                        className={
                            (pills
                                ? "border border-grey h-[38px] md:h-auto px-4 md:border-0 md:p-0 rounded-full "
                                : "") +
                            "flex gap-2 items-center justify-center text-dark-grey hover:text-black cursor-pointer"
                        }
                    >
                        <button className="flex gap-2 items-center justify-center text-xl">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    fillRule="evenodd"
                                    d="M15.218 4.931a.4.4 0 0 1-.118.132l.012.006a.45.45 0 0 1-.292.074.5.5 0 0 1-.3-.13l-2.02-2.02v7.07c0 .28-.23.5-.5.5s-.5-.22-.5-.5v-7.04l-2 2a.45.45 0 0 1-.57.04h-.02a.4.4 0 0 1-.16-.3.4.4 0 0 1 .1-.32l2.8-2.8a.5.5 0 0 1 .7 0l2.8 2.79a.42.42 0 0 1 .068.498m-.106.138.008.004v-.01zM16 7.063h1.5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-11c-1.1 0-2-.9-2-2v-10a2 2 0 0 1 2-2H8a.5.5 0 0 1 .35.15.5.5 0 0 1 .15.35.5.5 0 0 1-.15.35.5.5 0 0 1-.35.15H6.4c-.5 0-.9.4-.9.9v10.2a.9.9 0 0 0 .9.9h11.2c.5 0 .9-.4.9-.9v-10.2c0-.5-.4-.9-.9-.9H16a.5.5 0 0 1 0-1"
                                    clipRule="evenodd"
                                ></path>
                            </svg>
                        </button>
                        <p className={pills ? "md:hidden" : "hidden"}>Share</p>
                    </div>

                    {user.username == username && (
                        <div
                            className={
                                (pills
                                    ? "border border-grey h-[38px] md:h-auto px-4 md:border-0 md:p-0 rounded-full "
                                    : "") +
                                "flex gap-2 items-center justify-center text-dark-grey hover:text-black md:hover:underline cursor-pointer"
                            }
                        >
                            <Link href={`/editor/${slug}`}>Edit</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
});

BlogInteraction.displayName = "BlogInteraction";
export default BlogInteraction;

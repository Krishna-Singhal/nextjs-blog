"use client";

import Image from "next/image";
import React from "react";
import { timeAgo } from "@common/functions";
import ProfileImage from "@components/ui/ProfileImage";
import Link from "next/link";

const SimilarBlogCard = ({ blog }) => {
    const {
        slug,
        title,
        banner,
        des,
        author: {
            personal_info: { fullname, username, profile_img },
        },
        activity: { total_likes, total_comments },
        publishedAt,
    } = blog;
    return (
        <div className="pb-8 md:pb-10 px-4">
            <div className="border-b border-grey md:border-0">
                <Link href={`/blog/${slug}`}>
                    <div className="md:w-[285px] md:h-[155px] w-full h-auto">
                        <Image
                            src={banner}
                            className="w-full h-full"
                            width={0}
                            height={0}
                            sizes="100vw"
                            alt={title}
                        />
                    </div>
                </Link>
                <div className="flex flex-col">
                    <div className="flex gap-2 items-center mt-5">
                        <div className="w-6 h-6">
                            <ProfileImage src={profile_img} alt={fullname} />
                        </div>
                        <div className="">
                            <p className="hover:underline text-black">
                                <Link href={`/user/${username}`}>{fullname}</Link>
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link href={`/blog/${slug}`}>
                            <h2 className="!text-2xl !leading-7 line-clamp-2 !text-black font-bold">
                                {title}
                            </h2>
                            <h3 className="!text-xl !leading-5 line-clamp-2 text-dark-grey mt-3">
                                {des}
                            </h3>
                        </Link>
                    </div>
                    <div className="flex justify-between items-center p-2 py-4 mt-2">
                        <div className="flex items-center gap-5">
                            <div>{timeAgo(publishedAt)}</div>
                            <div className="flex gap-2 items-center justify-center group cursor-pointer">
                                <button className="flex items-center justify-center">
                                    <i className="fi fi-rr-heart mt-1 text-xl text-dark-grey group-hover:text-black"></i>
                                </button>
                                <p className="text-dark-grey group-hover:text-black">
                                    {total_likes}
                                </p>
                            </div>
                            <div className="flex gap-2 items-center justify-center group cursor-pointer">
                                <button className="flex items-center justify-center">
                                    <i className="fi fi-rr-comment-dots mt-1 text-xl text-dark-grey group-hover:text-black"></i>
                                </button>
                                <p className="text-dark-grey group-hover:text-black">
                                    {total_comments}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-5">
                            <div className="flex gap-2 items-center justify-center text-dark-grey hover:text-black cursor-pointer">
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
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SimilarBlogCard;

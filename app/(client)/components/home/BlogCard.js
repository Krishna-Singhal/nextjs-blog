"use client";

import Image from "next/image";
import React from "react";
import { formatCount, timeAgo } from "@common/functions";
import ProfileImage from "@components/ui/ProfileImage";
import Link from "next/link";

const BlogCard = ({ skeleton, blog }) => {
    if (skeleton) {
        return (
            <div className="flex items-center gap-2 w-full h-20 sm:h-24 bg-light-grey rounded-md">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full"></div>
                <div className="flex-1">
                    <div className="text-sm sm:text-base text-dark-grey">
                        <span className="block">Loading...</span>
                        <span className="block">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }
    const {
        title,
        banner,
        des,
        activity: { total_likes, total_comments },
        author,
        slug,
        publishedAt,
    } = blog;
    const { fullname, username, profile_img } = author.personal_info;

    return (
        <article>
            <div className="mt-8 border-b border-grey">
                <Link href={`/blog/${slug}`}>
                    <div className="w-full">
                        <div className="flex gap-2 items-center mb-4">
                            <div className="w-5 h-5 sm:w-6 sm:h-6">
                                <ProfileImage src={profile_img} alt={fullname} />
                            </div>
                            <p className="line-clamp-1 !text-[13px] sm:!text-base">{fullname}</p>
                        </div>
                        <div className="flex">
                            <div className="w-full">
                                <h2 className="blog-title !text-[16px] sm:!text-2xl md:!text-[22px] font-gt-super mb-2">
                                    {title}
                                </h2>
                                <h3 className="!text-[14px] !leading-4 sm:!text-xl md:!text-[18px] sm:!leading-7 line-clamp-2 text-dark-grey">
                                    {des}
                                </h3>
                                <div className="hidden md:block pt-3">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-4">
                                            <span className="text-dark-grey hover:text-black/80 cursor-pointer !text-base">
                                                {timeAgo(publishedAt)}
                                            </span>
                                            <div className="flex justify-between gap-4">
                                                <div className="flex items-center gap-2 text-dark-grey hover:text-black/80 cursor-pointer">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="none"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            fillRule="evenodd"
                                                            d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                                                            clipRule="evenodd"
                                                        ></path>
                                                    </svg>
                                                    <span className="!text-base">
                                                        {formatCount(total_likes)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-dark-grey hover:text-black/80 cursor-pointer">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        viewBox="0 0 16 16"
                                                    >
                                                        <path
                                                            fill="currentColor"
                                                            d="M12.344 11.458A5.28 5.28 0 0 0 14 7.526C14 4.483 11.391 2 8.051 2S2 4.483 2 7.527c0 3.051 2.712 5.526 6.059 5.526a6.6 6.6 0 0 0 1.758-.236q.255.223.554.414c.784.51 1.626.768 2.512.768a.37.37 0 0 0 .355-.214.37.37 0 0 0-.03-.384 4.7 4.7 0 0 1-.857-1.958v.014z"
                                                        ></path>
                                                    </svg>
                                                    <span className="!text-base">
                                                        {formatCount(total_comments)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="ml-6 md:ml-14">
                                <div className="w-[80px] sm:w-[180px]">
                                    <Image
                                        src={banner}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-full object-cover"
                                        alt={title}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="pt-3 md:hidden">
                            <div className="flex justify-between py-3">
                                <div className="flex items-center gap-4">
                                    <span className="text-dark-grey hover:text-black/80 cursor-pointer !text-sm">
                                        {timeAgo(publishedAt)}
                                    </span>
                                    <div className="flex justify-between gap-4">
                                        <div className="flex items-center gap-2 text-dark-grey hover:text-black/80 cursor-pointer">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="none"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    fillRule="evenodd"
                                                    d="m3.672 10.167 2.138 2.14h-.002c1.726 1.722 4.337 2.436 5.96.81 1.472-1.45 1.806-3.68.76-5.388l-1.815-3.484c-.353-.524-.849-1.22-1.337-.958-.49.261 0 1.56 0 1.56l.78 1.932L6.43 2.866c-.837-.958-1.467-1.108-1.928-.647-.33.33-.266.856.477 1.598.501.503 1.888 1.957 1.888 1.957.17.174.083.485-.093.655a.56.56 0 0 1-.34.163.43.43 0 0 1-.317-.135s-2.4-2.469-2.803-2.87c-.344-.346-.803-.54-1.194-.15-.408.406-.273 1.065.11 1.447.345.346 2.31 2.297 2.685 2.67l.062.06c.17.175.269.628.093.8-.193.188-.453.33-.678.273a.9.9 0 0 1-.446-.273S2.501 6.84 1.892 6.23c-.407-.406-.899-.333-1.229 0-.525.524.263 1.28 1.73 2.691.384.368.814.781 1.279 1.246m8.472-7.219c.372-.29.95-.28 1.303.244V3.19l1.563 3.006.036.074c.885 1.87.346 4.093-.512 5.159l-.035.044c-.211.264-.344.43-.74.61 1.382-1.855.963-3.478-.248-5.456L11.943 3.88l-.002-.037c-.017-.3-.039-.71.203-.895"
                                                    clipRule="evenodd"
                                                ></path>
                                            </svg>
                                            <span className="!text-sm">
                                                {formatCount(total_likes)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-dark-grey hover:text-black/80 cursor-pointer">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="16"
                                                height="16"
                                                fill="currentColor"
                                                viewBox="0 0 16 16"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    d="M12.344 11.458A5.28 5.28 0 0 0 14 7.526C14 4.483 11.391 2 8.051 2S2 4.483 2 7.527c0 3.051 2.712 5.526 6.059 5.526a6.6 6.6 0 0 0 1.758-.236q.255.223.554.414c.784.51 1.626.768 2.512.768a.37.37 0 0 0 .355-.214.37.37 0 0 0-.03-.384 4.7 4.7 0 0 1-.857-1.958v.014z"
                                                ></path>
                                            </svg>
                                            <span className="!text-sm">
                                                {formatCount(total_comments)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3"></div>
                            </div>
                        </div>
                    </div>
                </Link>
                <div className="mt-5"></div>
            </div>
        </article>
    );
};

export default BlogCard;

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { timeAgo } from "@common/functions";

const BlogStats = ({ stats }) => {
    return (
        <div className="flex gap-2 mb-6 pb-6 border-grey border-b lg:pb-0 lg:mb-0 lg:border-0">
            {Object.keys(stats).map((info, i) => {
                return (
                    <div
                        key={i}
                        className={
                            "flex flex-col items-center w-full h-full justify-center p-4 px-6 " +
                            (i != 0 && "border-grey border-l")
                        }
                    >
                        <h1 className="text-xl lg:text-2xl mb-2">{stats[info].toLocaleString()}</h1>
                        <p className="text-dark-grey capitalize">{info.split("_")[1]}</p>
                    </div>
                );
            })}
        </div>
    );
};

export const ManagePublishedBlogCard = ({ blog, onDelete, ref }) => {
    const { banner, slug, title, activity, publishedAt } = blog;
    const [showStats, setShowStats] = useState(false);

    const handleDelete = () => {
        onDelete(slug);
    };

    return (
        <div ref={ref}>
            <div className="flex gap-10 border-b mb-6 px-4 md:px-0 border-grey pb-6 items-center">
                <div className="hidden md:block lg:hidden xl:block w-32 flex-none bg-grey">
                    <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        className="w-full h-full object-cover"
                        src={banner}
                        alt={title}
                    />
                </div>

                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div className="">
                        <Link className="blog-title mb-4 hover:underline" href={`/blog/${slug}`}>
                            {title}
                        </Link>

                        <p className="line-clamp-1">Published: {timeAgo(publishedAt)}</p>
                    </div>

                    <div className="flex gap-6 mt-3">
                        <Link href={`/editor/${slug}`} className="pr-4 py-2 underline">
                            Edit
                        </Link>

                        <button
                            className="lg:hidden pr-4 py-2 underline"
                            onClick={() => {
                                setShowStats((p) => !p);
                            }}
                        >
                            Stats
                        </button>

                        <button onClick={handleDelete} className="pr-4 py-2 underline text-red">
                            Delete
                        </button>
                    </div>
                </div>

                <div className="hidden lg:block">
                    <BlogStats stats={activity} />
                </div>
            </div>

            {showStats && (
                <div className="lg:hidden">
                    <BlogStats stats={activity} />
                </div>
            )}
        </div>
    );
};

export const ManageDraftBlogCard = ({ blog, index, onDelete, ref }) => {
    const { title, des, slug } = blog;

    const handleDelete = () => {
        onDelete(slug);
    };

    return (
        <div ref={ref} className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
            <h1 className="blog-index text-center pl-4 md:pl-6 flex-none">
                {index < 10 ? "0" + index : index}
            </h1>
            <div>
                <h1 className="blog-title mb-3">{title}</h1>
                <p className="line-clamp-2 font-gelasio">{des.length ? des : "No Description"}</p>
                <div className="flex gap-6 mt-3">
                    <Link className="pr-4 py-2 underline" href={`/editor/${slug}`}>
                        Edit
                    </Link>
                    <button className="pr-4 py-2 underline text-red" onClick={handleDelete}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

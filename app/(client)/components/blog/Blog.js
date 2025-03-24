"use client";

import React, { useEffect } from "react";
import AnimationWrapper from "@common/page-animation";
import { useRouter } from "next/navigation";
import ProfileImage from "@components/ui/ProfileImage";
import Link from "next/link";
import { timeAgo } from "@common/functions";
import BlogInteraction from "@components/blog/BlogInteraction";
import SimilarBlogCard from "@components/blog/SimilarBlogCard";
import Image from "next/image";
import BlogContent from "@components/blog/BlogContent";
import { useBlog } from "@context/BlogContext";
import CommentsSidebar from "@components/blog/comments/Sidebar";
import Comments from "@components/blog/comments";

const Blog = () => {
    const router = useRouter();
    const { blog, blogStructure, setBlog, similarBlogs, setSimilarBlogs, slug } = useBlog();

    useEffect(() => {
        if (!blog) {
            const fetchBlog = async () => {
                try {
                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/blog/get?slug=${slug}`
                    );
                    if (!res.ok) throw new Error("Blog not found");

                    const data = await res.json();
                    if (!data.blog || Object.keys(data.blog).length === 0) {
                        throw new Error("Empty blog data");
                    }
                    setBlog(data.blog);
                } catch (error) {
                    router.replace("/404");
                }
            };
            fetchBlog();
        } else if (blog && Object.keys(blog).length === 0) {
            router.replace("/404");
        }
    }, [slug]);

    useEffect(() => {
        if (blog && blog.tags?.length > 0 && !similarBlogs) {
            const fetchSimilarBlogs = async () => {
                try {
                    const tags = blog.tags.map((tag) => tag._id);

                    const res = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/blog/similar?tags=${tags.join(
                            ","
                        )}&eliminate_blog=${slug}`
                    );
                    if (!res.ok) throw new Error("Similar blogs not found");

                    const data = await res.json();
                    setSimilarBlogs(data.blogs);
                } catch (error) {
                    console.error("Error fetching similar blogs:", error);
                }
            };
            fetchSimilarBlogs();
        }
    }, [blog]);

    const {
        title,
        des,
        banner,
        content,
        author: {
            personal_info: { fullname, username, profile_img },
        },
        tags,
        publishedAt,
    } = blog || blogStructure;

    return (
        <AnimationWrapper>
            {!blog ? (
                "Loading Blog..."
            ) : (
                <div>
                    <CommentsSidebar />
                    <div className="max-w-[700px] center py-10 px-[5vw] lg:px-0">
                        <h1 className="blog-title text-black text-[42px] my-5 leading-[52px] font-bold">
                            {title}
                        </h1>
                        <div className="flex gap-5 items-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 mt-1">
                                <ProfileImage src={profile_img} alt={fullname} />
                            </div>
                            <div className="mt-2">
                                <p className="hover:underline text-black">
                                    <Link href={`/user/${username}`}>{fullname}</Link>
                                </p>
                                <p className="text-dark-grey flex gap-3">
                                    <span>18 min read</span>
                                    <span>·</span>
                                    <span>{timeAgo(publishedAt)}</span>
                                </p>
                            </div>
                        </div>
                        <BlogInteraction />
                        <div className="my-12 font-gelasio blog-page-content">
                            <div className="aspect-video">
                                <Image
                                    src={banner}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    alt={title}
                                    className="w-full rounded-lg object-fill"
                                />
                            </div>
                            {content[0].blocks.map((block, i) => (
                                <div key={i} className="my-4 md:my-8">
                                    <BlogContent block={block} />
                                </div>
                            ))}
                        </div>
                        <BlogInteraction second={true} />
                        {tags?.length && (
                            <div className="mt-5 flex items-center flex-wrap gap-3">
                                {tags.map((tag, i) => {
                                    return (
                                        <div
                                            className="border border-grey py-2 px-4 text-dark-grey hover:text-black rounded-lg bg-purple/5"
                                            key={i}
                                        >
                                            {tag.name}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    <hr className="my-5" />
                    <div className="max-w-[700px] center py-10 px-[5vw] lg:px-0">
                        <Comments showMinimal={true} />
                    </div>
                    <div className="bg-[#F9F9F9]">
                        <div className="max-w-[700px] center py-10 px-[5vw] lg:px-0 pt-20">
                            {!similarBlogs ? (
                                <div>Loading Similar Blogs...</div>
                            ) : (
                                <>
                                    {similarBlogs?.length && (
                                        <>
                                            <h2 className="!text-black !text-2xl !font-medium">
                                                Recommended from {process.env.NEXT_PUBLIC_APP_NAME}
                                            </h2>
                                            <div className="grid grid-cols-1 md:grid-cols-2 mt-10">
                                                {similarBlogs.map((blog, i) => (
                                                    <AnimationWrapper
                                                        transition={{
                                                            duration: 1,
                                                            delay: 0.08 * i,
                                                        }}
                                                        key={i}
                                                    >
                                                        <SimilarBlogCard blog={blog} />
                                                    </AnimationWrapper>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AnimationWrapper>
    );
};

export default Blog;

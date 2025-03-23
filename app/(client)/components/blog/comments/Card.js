"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import ProfileImage from "@components/ui/ProfileImage";
import Link from "next/link";
import { timeAgo } from "@common/functions";
import { useModal } from "@context/ModalContext";
import { useUser } from "@context/UserContext";
import CommentField from "@components/ui/CommentField";
import AnimationWrapper from "@common/page-animation";
import { useBlog } from "@context/BlogContext";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

const fetchReplies = async ({ pageParam = 1, queryKey }) => {
    const [, comment_id] = queryKey;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/replies/get?_id=${comment_id}&page=${pageParam}`
    );
    if (!res.ok) throw new Error("Failed to fetch replies");
    const data = await res.json();
    return {
        replies: data.replies,
        nextPage: pageParam + 1,
        isLast: data.replies.length < PAGE_SIZE,
    };
};

const CommentCard = ({ index, commentData, isReply = false, ref = null, isLast = false }) => {
    const { user } = useUser();
    const { blog, blogStructure } = useBlog();
    const { toggleModal } = useModal();
    const queryClient = useQueryClient();
    const {
        author: {
            personal_info: { username: blog_author },
        },
        slug,
    } = blog || blogStructure;
    const {
        _id,
        comment,
        user: {
            personal_info: { fullname, profile_img, username },
        },
        activity: { total_replies },
        commentedAt,
    } = commentData;
    const { comments, setComments } = useBlog();
    const [isReplying, setIsReplying] = useState(false);
    const [showReplies, setShowReplies] = useState(false);

    const {
        data: repliesData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["replies", _id],
        queryFn: fetchReplies,
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        initialData: undefined,
        enabled: showReplies,
    });

    useEffect(() => {
        if (repliesData) {
            setComments((prevComments) => {
                const newComments = [...prevComments];
                newComments[index] = {
                    ...newComments[index],
                    replies: repliesData.pages.flatMap((page) => page.replies),
                };
                return newComments;
            });
        }
    }, [repliesData]);

    const observer = useRef(null);
    const lastReplyElementRef = useCallback(
        (node) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting && hasNextPage) {
                        fetchNextPage();
                    }
                },
                {
                    threshold: 0.5,
                }
            );
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
    }, [comments, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleReplyClick = () => {
        if (user?.access_token) {
            setIsReplying((p) => !p);
        } else {
            toggleModal({ modalType: "signup" });
        }
    };

    const handleDelete = async (e) => {
        e.target.disabled = true;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity/comment/delete`, {
            method: "POST",
            headers: { Authorization: "Bearer " + user.access_token },
            body: JSON.stringify({
                _id,
            }),
        });
        e.target.disabled = false;
        if (res.ok) {
            toast.success("Comment deleted.");
            queryClient.invalidateQueries(["commentsCount", slug]);
            setComments((prevComments) => {
                return prevComments
                    .map((comment, idx) => {
                        if (!isReply) {
                            return comment._id !== _id ? comment : null;
                        } else if (idx === index) {
                            return {
                                ...comment,
                                addedReplied:
                                    comment.addedReplied?.filter((reply) => reply._id !== _id) ||
                                    [],
                                replies:
                                    comment.replies?.filter((reply) => reply._id !== _id) || [],
                            };
                        }
                        return comment;
                    })
                    .filter(Boolean);
            });
        } else {
            toast.error("Failed to delete comment.");
        }
    };

    return (
        <div ref={ref}>
            <div
                className={"pb-5 " + (isReply ? "ml-6 border-l-[3px] border-grey pl-6" : "w-full")}
            >
                <div className="flex gap-5 items-center">
                    <div className="w-8 h-8">
                        <ProfileImage src={profile_img} alt={fullname} />
                    </div>
                    <div className="mt-2">
                        <p className="hover:underline text-black">
                            <Link href={`/user/${username}`}>{fullname}</Link>
                        </p>
                        <p className="text-dark-grey mb-0">{timeAgo(commentedAt)}</p>
                    </div>
                </div>
                <p className="font-gelasio text-base text-black leading-6 mt-3">{comment}</p>
                <div className="ml-3 flex gap-5 items-center my-4">
                    {!isReply && total_replies > 0 && (
                        <button
                            onClick={() => {
                                setShowReplies((p) => !p);
                            }}
                            className="text-sm text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2"
                        >
                            <i className="fi fi-rr-comment-dots"></i>
                            {showReplies ? "Hide " : `Show ${total_replies} `}replies
                        </button>
                    )}
                    <button className="underline text-sm" onClick={handleReplyClick}>
                        Reply
                    </button>

                    {(username == user.username || user.username == blog_author) && (
                        <button
                            onClick={handleDelete}
                            className="p-2 px-3 ml-auto hover:text-red flex items-center"
                        >
                            <i className="fi fi-rr-trash pointer-events-none"></i>
                        </button>
                    )}
                </div>
                {isReplying && (
                    <div
                        className={
                            "mt-8 ml-6 border-l-[3px] border-grey pl-6 " + (!isReply && "pb-4")
                        }
                    >
                        <CommentField
                            action="reply"
                            index={index}
                            isReply={true}
                            setReplying={setIsReplying}
                        />
                    </div>
                )}

                <div ref={containerRef}>
                    {commentData.addedReplies &&
                        commentData.addedReplies?.length &&
                        commentData.addedReplies.map((reply, i) => {
                            const isLast = i === commentData.addedReplies.length - 1;
                            return (
                                <AnimationWrapper
                                    key={i}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                >
                                    <CommentCard
                                        index={index}
                                        commentData={reply}
                                        isReply={true}
                                        isLast={
                                            isLast &&
                                            (!showReplies ||
                                                !(
                                                    commentData.replies &&
                                                    commentData.replies?.length
                                                ))
                                        }
                                    />
                                </AnimationWrapper>
                            );
                        })}

                    {showReplies &&
                        commentData.replies &&
                        commentData.replies?.length > 0 &&
                        commentData.replies.map((reply, i) => {
                            const isLast = i === commentData.replies.length - 1;
                            return (
                                <AnimationWrapper
                                    key={i}
                                    transition={{ duration: 1, delay: i * 0.1 }}
                                >
                                    <CommentCard
                                        index={index}
                                        commentData={reply}
                                        isReply={true}
                                        isLast={isLast}
                                        ref={isLast ? lastReplyElementRef : null}
                                    />
                                </AnimationWrapper>
                            );
                        })}
                </div>
                {!isLast && <hr className="border-grey w-full mt-4" />}
            </div>
        </div>
    );
};

export default CommentCard;

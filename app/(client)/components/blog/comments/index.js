import { useCallback, useEffect, useRef } from "react";
import { useBlog } from "@context/BlogContext";
import CommentField from "@components/ui/CommentField";
import ProfileImage from "@components/ui/ProfileImage";
import { useUser } from "@context/UserContext";
import { useInfiniteQuery } from "@tanstack/react-query";
import AnimationWrapper from "@common/page-animation";
import NoDataMessage from "@components/ui/no-data";
import CommentCard from "@components/blog/comments/Card";

const PAGE_SIZE = 10;

const fetchComments = async ({ pageParam = 1, queryKey }) => {
    const [, blog] = queryKey;
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/activity/comment/get?blog=${blog}&page=${pageParam}`
    );
    if (!res.ok) throw new Error("Failed to fetch comments");
    const data = await res.json();
    return {
        comments: data.comments,
        nextPage: pageParam + 1,
        isLast: data.comments.length < PAGE_SIZE,
    };
};

const Comments = () => {
    let { blog, comments, setComments } = useBlog();
    const { user } = useUser();

    const {
        data: commentsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["comments", blog._id],
        queryFn: fetchComments,
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        initialData: undefined,
    });

    useEffect(() => {
        if (commentsData) {
            setComments(commentsData.pages.flatMap((page) => page.comments));
        }
    }, [commentsData]);

    const observer = useRef(null);
    const lastCommentElementRef = useCallback(
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

    return (
        <>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8">
                    <ProfileImage
                        src={user?.profile_img}
                        alt={user?.fullname || "Default User"}
                        className="border"
                    />
                </div>
                <div>{user.fullname || "Write a comment"}</div>
            </div>
            <CommentField action="comment" />
            <hr className="border-grey my-10 w-[120%] -ml-5" />
            <div ref={containerRef}>
                {status === "pending" ? (
                    <p>Loading skeleton...</p>
                ) : status === "error" ? (
                    <p>Error loading comments: {error.message}</p>
                ) : comments?.length ? (
                    <div className="comments-list">
                        {comments.map((comment, index) => {
                            const isLast = index === comments.length - 1;
                            return (
                                <AnimationWrapper
                                    key={index}
                                    transition={{ duration: 1, delay: index * 0.1 }}
                                >
                                    <CommentCard
                                        index={index}
                                        commentData={comment}
                                        ref={isLast ? lastCommentElementRef : null}
                                        isLast={isLast}
                                    />
                                </AnimationWrapper>
                            );
                        })}
                    </div>
                ) : (
                    <NoDataMessage message="No comments to show!" />
                )}

                {isFetchingNextPage && <p>Loading more comments...</p>}
                {!hasNextPage && commentsData?.pages?.length > 2 && status !== "pending" && (
                    <p>No more comments.</p>
                )}
            </div>
        </>
    );
};

export default Comments;

import React, { useState } from "react";
import ProfileImage from "@components/ui/ProfileImage";
import Link from "next/link";
import { timeAgo } from "@common/functions";
import ReplyField from "@components/dashboard/ReplyField";
import { useUser } from "../../context/UserContext";

const NotificationCard = ({ data, index }) => {
    const {
        _id: notification_id,
        user: {
            personal_info: { fullname, username, profile_img },
        },
        blog: { _id, title, slug },
        type,
        comment: { comment, parentComment },
        reply,
        createdAt,
    } = data;
    const { user } = useUser();

    const [replying, setReplying] = useState(false);

    const handleReplyClick = () => {
        setReplying((p) => !p);
    };

    return (
        <div className="p-6 border-b border-grey border-l-black ">
            <div className="flex gap-5 mb-3">
                <div className="w-14 h-14 flex-none">
                    <ProfileImage src={profile_img} alt={fullname} />
                </div>
                <div className="w-full">
                    <h1 className="font-medium text-xl text-dark-grey">
                        <span className="hidden lg:inline-block capitalize">{fullname}</span>
                        <Link className="mx-1 text-black underline" href={`/user/${username}`}>
                            @{username}
                        </Link>
                        <span className="font-normal">
                            {type == "like"
                                ? "liked your blog"
                                : type == "comment"
                                ? "commented on"
                                : "replied on"}
                        </span>
                    </h1>

                    {type == "reply" ? (
                        <div className="p-4 mt-4 rounded-md bg-grey">
                            <p>{parentComment?.comment}</p>
                        </div>
                    ) : (
                        <Link
                            className="font-medium text-dark-grey hover:underline line-clamp-1"
                            href={`/blog/${slug}`}
                        >{`"${title}"`}</Link>
                    )}
                </div>
            </div>

            {type != "like" && <p className="ml-14 pl-5 font-gelasio text-xl my-5">{comment}</p>}

            <div className="ml-14 pl-5 mt-3 text-dark-grey flex gap-8">
                <p>{timeAgo(createdAt)}</p>

                {type != "like" && (
                    <>
                        {(!reply || Object.keys(reply).length === 0) && (
                            <button
                                onClick={handleReplyClick}
                                className="underline hover:text-black text-dark-grey"
                            >
                                Reply
                            </button>
                        )}
                        <button className="underline text-red/70 hover:text-red/90">Delete</button>
                    </>
                )}
            </div>
            {replying && (
                <div className={"mt-8 ml-6 pl-6"}>
                    <ReplyField
                        _id={_id}
                        notification_id={notification_id}
                        parentComment={parentComment || _id}
                        index={index}
                        setReplying={setReplying}
                    />
                </div>
            )}

            {reply && Object.keys(reply).length > 0 && (
                <div className="ml-20 rounded-md p-5 bg-grey mt-5">
                    <div className="flex gap-3 mb-3">
                        <div className="w-8 h-8">
                            <ProfileImage src={profile_img} alt={fullname} />
                        </div>
                        <div>
                            <h1 className="font-medium text-xl text-dark-grey">
                                <Link
                                    className="mx-1 text-black underline"
                                    href={`/user/${user.username}`}
                                >
                                    @{user.username}
                                </Link>
                                <span className="font-normal">replied to</span>
                                <Link
                                    className="mx-1 text-black underline"
                                    href={`/user/${username}`}
                                >
                                    @{username}
                                </Link>
                            </h1>
                        </div>
                    </div>
                    <p className="ml-14 font-gelasio text-xl my-2">{reply.comment}</p>
                </div>
            )}
        </div>
    );
};

export default NotificationCard;

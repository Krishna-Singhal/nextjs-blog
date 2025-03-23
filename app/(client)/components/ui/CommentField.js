import React, { useRef, useState } from "react";
import { useUser } from "@context/UserContext";
import { useModal } from "@context/ModalContext";
import toast from "react-hot-toast";
import { useBlog } from "@context/BlogContext";

const CommentField = ({ action, index, isReply, setReplying }) => {
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const { user } = useUser();
    const { toggleModal } = useModal();
    const { blog, blogStructure, setBlog, comments, setComments } = useBlog();
    const {
        _id,
        activity,
        activity: { total_comments },
    } = blog || blogStructure;

    const handleTitleChange = (e) => {
        let titleInput = e.target;
        titleInput.style.height = "auto";
        titleInput.style.height = `${titleInput.scrollHeight}px`;
        setComment(e.target.value);
    };

    const handleFocus = (e) => {
        if (user?.access_token) {
            setIsFocused(true);
        } else {
            toggleModal({ modalType: "signin" });
        }
    };

    const handleComment = async () => {
        if (user?.access_token) {
            if (!comment.length) {
                toast.error("You must enter a comment");
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity/comment/add`, {
                method: "POST",
                headers: { Authorization: `Bearer ${user.access_token}` },
                body: JSON.stringify({
                    _id,
                    comment,
                    parentComment: isReply ? comments[index]._id : null,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                setComment("");
                setIsFocused(false);
                if (setReplying) setReplying(false);
                data.comment.user = {
                    personal_info: {
                        fullname: user?.fullname,
                        username: user?.username,
                        profile_img: user?.profile_img,
                    },
                };
                let newCommentArr;
                if (isReply) {
                    comments[index].addedReplies = [
                        ...(comments[index].addedReplies || []),
                        data.comment,
                    ];
                    newCommentArr = comments;
                } else {
                    newCommentArr = [data.comment, ...comments];
                }
                setComments(newCommentArr);
                setBlog({
                    ...blog,
                    activity: { ...activity, total_comments: total_comments + 1 },
                });
            } else {
                toast.error("Failed to add comment");
                console.log(data.message);
            }
        }
    };

    return (
        <div
            className={`bg-grey rounded-lg transition-all duration-300 ${
                isFocused || action == "reply" ? "p-1" : "px-2"
            }`}
        >
            <div onClick={handleFocus}>
                <textarea
                    value={comment}
                    placeholder={`Leave a ${action}...`}
                    readOnly={!user?.access_token}
                    className={`input-box py-3 p-2 placeholder:text-dark-grey resize-none overflow-hidden outline-none transition-all duration-300 ${
                        isFocused || action == "reply" ? "p-4 h-[70px]" : "!h-[40px] cursor-pointer"
                    } w-full`}
                    onChange={handleTitleChange}
                    autoFocus={false}
                    onBlur={() => {
                        if (!comment.trim()) setIsFocused(false);
                    }}
                ></textarea>
            </div>
            {(isFocused || action == "reply") && (
                <div className="flex justify-between items-center p-4 transition-opacity duration-300">
                    <div></div>
                    <div className="flex gap-0 items-center">
                        <button
                            className="py-2 px-4 text-black/85 hover:text-black"
                            onClick={() => {
                                setComment("");
                                setIsFocused(false);
                                if (setReplying) setReplying(false);
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-dark text-base disabled:opacity-10 capitalize"
                            disabled={!comment?.length}
                            onClick={handleComment}
                        >
                            {action}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentField;

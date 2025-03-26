import React, { useRef, useState } from "react";
import { useUser } from "@context/UserContext";
import toast from "react-hot-toast";
import { useNotification } from "../../context/NotificationContext";

const ReplyField = ({ _id, notification_id, parentComment, index, setReplying }) => {
    const [comment, setComment] = useState("");
    const { user } = useUser();
    const { setNotifications } = useNotification();

    const handleTitleChange = (e) => {
        let titleInput = e.target;
        titleInput.style.height = "auto";
        titleInput.style.height = `${titleInput.scrollHeight}px`;
        setComment(e.target.value);
    };

    const handleComment = async () => {
        if (!comment.length) {
            toast.error("You must enter a comment");
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/activity/comment/add`, {
            method: "POST",
            headers: { Authorization: `Bearer ${user.access_token}` },
            body: JSON.stringify({
                _id,
                comment,
                parentComment,
                notification_id,
            }),
        });
        const data = await res.json();
        if (res.ok) {
            setComment("");
            setReplying(false);
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification, i) =>
                    i === index
                        ? { ...notification, reply: { comment, _id: data.comment._id } }
                        : notification
                )
            );
        } else {
            toast.error("Failed to add comment");
            console.log(data.message);
        }
    };

    return (
        <div className={`bg-grey rounded-lg transition-all duration-300 p-1 `}>
            <textarea
                value={comment}
                placeholder={`Leave a reply...`}
                className={`input-box py-3 placeholder:text-dark-grey resize-none overflow-hidden outline-none transition-all duration-300 p-4 h-[70px] w-full`}
                onChange={handleTitleChange}
            ></textarea>
            <div className="flex justify-between items-center p-4 transition-opacity duration-300">
                <div></div>
                <div className="flex gap-0 items-center">
                    <button
                        className="py-2 px-4 text-black/85 hover:text-black"
                        onClick={() => {
                            setComment("");
                            setReplying(false);
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        className="btn-dark text-base disabled:opacity-10 capitalize"
                        disabled={!comment?.length}
                        onClick={handleComment}
                    >
                        Reply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReplyField;

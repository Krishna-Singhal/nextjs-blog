"use client";

import { useBlog } from "@context/BlogContext";
import Comments from "@components/blog/comments";

const CommentsSidebar = () => {
    const { blog, commentsWrapper, setCommentsWrapper } = useBlog();
    let {
        activity: { total_comments },
    } = blog;

    return (
        <div
            className={`w-full fixed ${
                commentsWrapper ? "top-0 sm:right-0" : "top-[100%] sm:right-[-100%]"
            } duration-700 right-0 sm:top-0 sm:w-[30%] min-w-[350px] h-full z-50 bg-white shadow-2xl p-8 px-6 overflow-y-auto overflow-x-hidden`}
        >
            <div className="relative">
                <h1 className="text-2xl font-medium">Comments ({total_comments})</h1>

                <button
                    onClick={() => {
                        setCommentsWrapper((p) => !p);
                    }}
                    className="absolute top-1/2 -translate-y-1/2 right-0 flex justify-center items-center w-12"
                >
                    <i className="fi fi-br-cross text-dark-grey"></i>
                </button>
            </div>
            <hr className="border-grey my-8 w-full" />

            <Comments />
        </div>
    );
};

export default CommentsSidebar;

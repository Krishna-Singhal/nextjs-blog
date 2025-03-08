"use client";
import AnimationWrapper from "@common/page-animation";
import Link from "next/link";
import { useUser } from "@context/UserContext";
import { removeCookie } from "@/app/server/cookies";

const UserNavigation = () => {
    const { user, setUser } = useUser();

    const signoutUser = async () => {
        removeCookie("user");
        setUser({});
    };

    return (
        <AnimationWrapper transition={{ duration: 0.2 }} classname="absolute right-0 z-50">
            <div
                onMouseDown={(e) => e.preventDefault()}
                className="bg-white absolute right-0 border border-grey duration-200"
            >
                <Link
                    href="/editor"
                    className="flex gap-2 link md:hidden py-4 pl-8 text-dark-grey hover:text-black"
                >
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <Link
                    href={`/user/${user.username}`}
                    className="link pl-8 py-4 text-dark-grey hover:text-black"
                >
                    Profile
                </Link>
                <Link
                    href="/dashboard/blogs"
                    className="link pl-8 py-4 text-dark-grey hover:text-black"
                >
                    Dashboard
                </Link>
                <Link
                    href="/settings/edit-profile"
                    className="link pl-8 py-4 text-dark-grey hover:text-black"
                >
                    Settings
                </Link>

                <span className="absolute border-t border-grey w-[100%]"></span>

                <button
                    onClick={signoutUser}
                    className="text-left p-4 hover:bg-grey w-full pl-8 py-4 text-dark-grey hover:text-black"
                >
                    <h1 className="mb-1">Sign Out</h1>
                    <p className="text-dark-grey text-sm">{user.email}</p>
                </button>
            </div>
        </AnimationWrapper>
    );
};

export default UserNavigation;

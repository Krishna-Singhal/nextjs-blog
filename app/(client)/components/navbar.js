"use client";

import { useModal } from "@context/ModalContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useUser } from "@context/UserContext";
import UserNavigation from "@components/navbar/user-navigation";

const Navbar = () => {
    const [searchBoxVisibility, setsearchBoxVisibility] = useState(false);
    const [userNavPanel, setuserNavPanel] = useState(false);

    const { toggleModal } = useModal();
    const { user } = useUser();

    const handleUserNavToggle = () => {
        setuserNavPanel((p) => !p);
    };

    return (
        <nav className="navbar">
            <Link href="/" className="flex-none w-10">
                <Image src="/imgs/logo.png" alt="Logo" width={35} height={44} className="w-full" />
            </Link>

            <div
                className={`absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${
                    searchBoxVisibility ? "show" : "hide"
                }`}
            >
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full md:w-auto bg-grey p-3 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
            </div>
            <div className="flex items-center gap-3 md:gap-6 ml-auto">
                <button
                    className="md:hidden bg-grey w-10 h-10 rounded-full flex items-center justify-center"
                    onClick={() => {
                        setsearchBoxVisibility((p) => !p);
                    }}
                >
                    <i className="fi fi-rr-search text-base"></i>
                </button>

                <Link
                    href="/editor"
                    className="hidden md:flex gap-2 text-dark-grey hover:text-black"
                >
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                {user.access_token ? (
                    <>
                        <Link href="dashboard/notifications">
                            <button className="w-10 h-10 rounded-full bg-grey relative hover:bg-black/10">
                                <i className="fi fi-rr-bell text-xl block mt-1 text-dark-grey hover:text-black"></i>
                            </button>
                        </Link>
                        <div
                            className="relative"
                            onClick={handleUserNavToggle}
                            onBlur={handleUserNavToggle}
                        >
                            <button className="w-10 h-10 mt-1">
                                {user.profile_img.includes("api.dicebear.com") ? (
                                    <img
                                        src={user.profile_img}
                                        alt={user.fullname}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                ) : (
                                    <Image
                                        src={user.profile_img}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        className="w-full h-full object-cover rounded-full"
                                        alt={user.fullname}
                                        // referrerPolicy="no-referrer"
                                    />
                                )}
                            </button>
                            {userNavPanel && <UserNavigation />}
                        </div>
                    </>
                ) : (
                    <>
                        <button
                            className="text-dark-grey hover:text-black hidden md:block"
                            onClick={() => {
                                toggleModal({ modalType: "signin" });
                            }}
                        >
                            Sign in
                        </button>
                        <button
                            className="btn-dark py-2 px-4 text-base leading-6"
                            onClick={() => {
                                toggleModal({ modalType: "signup" });
                            }}
                        >
                            Get Started
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;

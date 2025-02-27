"use client";

import { useModal } from "@context/ModalContext";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
    const [searchBoxVisibility, setsearchBoxVisibility] = useState(false);
    const { toggleModal } = useModal();

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
                    className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
                    onClick={() => {
                        setsearchBoxVisibility((p) => !p);
                    }}
                >
                    <i className="fi fi-rr-search text-xl"></i>
                </button>

                <Link
                    href="/editor"
                    className="hidden md:flex gap-2 text-dark-grey hover:text-black"
                >
                    <i className="fi fi-rr-file-edit"></i>
                    <p>Write</p>
                </Link>
                <button
                    className="text-dark-grey hover:text-black"
                    onClick={() => {
                        toggleModal({ modalType: "signin" });
                    }}
                >
                    Sign in
                </button>
                <button
                    className="btn-dark py-2 px-4 hidden md:block text-base leading-6"
                    onClick={() => {
                        toggleModal({ modalType: "signup" });
                    }}
                >
                    Get Started
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

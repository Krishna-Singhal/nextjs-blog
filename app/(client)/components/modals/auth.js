"use client";

import { useModal } from "@context/ModalContext";
import { DialogHeader, DialogBody } from "@material-tailwind/react";
import Link from "next/link";
const AuthModal = () => {
    const { modal, setModal, setEmailModal } = useModal();
    const modalType = modal == "signin" ? "Sign in" : "Sign up";

    const handleGoogleAuth = () => {
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/b/callback/google_auth&response_type=token&scope=openid%20email%20profile`;
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <DialogHeader className="font-gt-super text-3xl font-normal text-black">
                {modal == "signin" ? "Welcome back." : "Join Us."}
            </DialogHeader>
            <DialogBody className="mt-16">
                <div className="flex justify-center">
                    <button
                        onClick={handleGoogleAuth}
                        className="flex justify-between items-center rounded-full border md:w-[300px] w-[280px] border-black px-3 py-2 text-xl text-black"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <g fillRule="evenodd" clipRule="evenodd">
                                <path
                                    fill="#4285F4"
                                    d="M20.64 12.205q-.002-.957-.164-1.84H12v3.48h4.844a4.14 4.14 0 0 1-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615"
                                ></path>
                                <path
                                    fill="#34A853"
                                    d="M12 21c2.43 0 4.468-.806 5.957-2.18L15.05 16.56c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H3.958v2.332A9 9 0 0 0 12.001 21"
                                ></path>
                                <path
                                    fill="#FBBC05"
                                    d="M6.964 13.712a5.4 5.4 0 0 1-.282-1.71c0-.593.102-1.17.282-1.71V7.96H3.957A9 9 0 0 0 3 12.002c0 1.452.348 2.827.957 4.042z"
                                ></path>
                                <path
                                    fill="#EA4335"
                                    d="M12 6.58c1.322 0 2.508.455 3.441 1.346l2.582-2.58C16.463 3.892 14.427 3 12 3a9 9 0 0 0-8.043 4.958l3.007 2.332c.708-2.127 2.692-3.71 5.036-3.71"
                                ></path>
                            </g>
                        </svg>
                        {modalType} with Google
                        <div className="w-3 h-3"></div>
                    </button>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            setEmailModal(modal);
                            setModal("emailauth");
                        }}
                        className="flex justify-between items-center rounded-full border md:w-[300px] w-[280px] border-black px-3 py-2 text-xl text-black mt-5"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <g stroke="#242424">
                                <rect width="17" height="13" x="3.5" y="5.505" rx="1"></rect>
                                <path strokeLinecap="round" d="m3.5 8.005 8.5 6 8.5-6"></path>
                            </g>
                        </svg>
                        {modalType} with Email
                        <div className="w-3 h-3"></div>
                    </button>
                </div>

                <div className="text-center mt-12 text-black text-xl">
                    {modal == "signin" ? "No account?" : "Already have an account?"}{" "}
                    <button
                        className="font-bold text-[#1a8917]"
                        onClick={() => {
                            setModal(modal == "signin" ? "signup" : "signin");
                        }}
                    >
                        {modal == "signin" ? "Create one" : "Sign in"}
                    </button>
                </div>

                <div className="text-center mt-40 max-w-[500px] text-dark-grey text-[13px]">
                    Click “{modalType}” to agree to {process.env.NEXT_PUBLIC_APP_NAME}’s{" "}
                    <Link href="/terms-condition" className="underline">
                        Terms of Service
                    </Link>{" "}
                    and acknowledge that {process.env.NEXT_PUBLIC_APP_NAME}’s{" "}
                    <Link href="/privacy-policy" className="underline">
                        Privacy Policy
                    </Link>{" "}
                    applies to you.
                </div>
            </DialogBody>
        </div>
    );
};

export default AuthModal;

"use client";
import { generateMagicLink } from "@/app/server/generateMagicLink";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";

const LinkExpired = ({ mode }) => {
    const [inputEmail, setInputEmail] = useState("");
    const [emailSent, setEmailSent] = useState(false);
    const [modalElement, setModalElement] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailRegex.test(inputEmail)) {
            try {
                const response = await generateMagicLink(inputEmail, mode);
                if (response.success) {
                    setEmailSent(true);
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.log(error);
                toast.error("Something went wrong. Please try again.");
            }
        } else {
            toast.error("Please enter a valid email");
        }
    };

    useEffect(() => {
        if (!modalElement) return;
        modalElement.parentElement.classList.add("custom-backdrop-for-callback-modal");
        return () => {
            setTimeout(() => {
                modalElement.parentElement.classList.remove("custom-backdrop-for-callback-modal");
            }, 480);
        };
    }, [modalElement]);

    return (
        <Dialog
            open={true}
            handler={null}
            onBlur={null}
            ref={(el) => setModalElement(el)}
            animate={{
                mount: { scale: 0.95, y: 50, opacity: 0, transition: { duration: 0 } },
                mount: {
                    scale: 1,
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                },
                unmount: { scale: 1, y: 0, transition: { duration: 0 } },
            }}
            className="m-auto w-screen h-screen md:h-auto md:w-[850px] max-w-[100%] md:max-w-[650px] !min-w-0 shadow-[0px_2px_10px_rgba(0,0,0,0.15)]"
        >
            <div className="pt-40 md:py-11 px-14 h-full min-h-[600px]">
                {emailSent ? (
                    <div className="flex flex-col items-center justify-center mt-32">
                        <DialogHeader className="font-gt-super text-3xl font-normal text-black">
                            Check your Inbox
                        </DialogHeader>
                        <DialogBody className="mt-2 flex items-center flex-col">
                            <p className="text-center text-xl max-w-[300px] text-black">
                                Click the link we sent to {inputEmail} to{" "}
                                {mode == "signin" ? "sign in" : "complete your account set-up"}.
                            </p>
                            <div className="flex flex-col items-center justify-center mt-0 gap-3">
                                <Link
                                    className="mt-5 btn-dark px-5 py-2 text-base font-normal"
                                    href="/m/signin"
                                >
                                    Ok
                                </Link>
                            </div>
                        </DialogBody>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center">
                        <DialogHeader className="font-gt-super text-3xl font-normal text-black">
                            Your {mode == "signin" ? "sign in" : "sign up"} link has expired
                        </DialogHeader>
                        <DialogBody className="mt-5">
                            <p className="text-center text-xl max-w-[300px] text-black">
                                Enter the email address associated with your account, and we’ll send
                                a new magic link to your inbox.
                            </p>
                            <div className="flex flex-col items-center justify-center mt-10 gap-3">
                                <label htmlFor="emailInput" className="text-dark-grey text-base">
                                    Your email
                                </label>
                                <input
                                    id="emailInput"
                                    type="email"
                                    value={inputEmail}
                                    onChange={(e) => setInputEmail(e.target.value)}
                                    className="w-[270px] p-2 text-black font-monospace border-b border-dark-grey focus:outline-none text-xl"
                                />

                                <button
                                    className="mt-10 btn-dark px-4 py-2 text-base font-normal w-[226px]"
                                    onClick={handleSubmit}
                                >
                                    Continue
                                </button>
                            </div>

                            <div className="flex justify-center items-center mt-10 text-[#1a8917]">
                                <Link className="flex items-center gap-1" href="/m/signin">
                                    <svg width="22" height="22" viewBox="0 0 19 19">
                                        <path
                                            fillRule="evenodd"
                                            fill="#1a8917"
                                            d="M11.47 13.969 6.986 9.484 11.47 5l.553.492L8.03 9.484l3.993 3.993z"
                                        ></path>
                                    </svg>
                                    All {mode == "signin" ? "sign in" : "sign up"} options
                                </Link>
                            </div>
                        </DialogBody>
                    </div>
                )}
            </div>
        </Dialog>
    );
};

export default LinkExpired;

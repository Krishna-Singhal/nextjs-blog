"use client";
import { Dialog, DialogBody, DialogHeader } from "@material-tailwind/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const AuthError = ({ mode }) => {
    const [modalElement, setModalElement] = useState(null);

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
            <div className="pt-80 md:py-40 px-14 h-full min-h-[600px]">
                <div className="flex flex-col items-center justify-center">
                    <DialogHeader className="font-gt-super text-3xl font-normal text-black text-center">
                        Apologies, but something went wrong.
                    </DialogHeader>
                    <DialogBody className="mt-0">
                        <p className="text-center text-xl max-w-[300px] text-black">
                            Please try signing up again.
                        </p>
                        <div className="mt-5 flex justify-center items-center">
                            <Link
                                className="btn-dark py-2 text-base font-normal px-5"
                                href="/m/signin"
                            >
                                Back to {mode == "signin" ? "sign in" : "sign up"}
                            </Link>
                        </div>
                    </DialogBody>
                </div>
            </div>
        </Dialog>
    );
};

export default AuthError;

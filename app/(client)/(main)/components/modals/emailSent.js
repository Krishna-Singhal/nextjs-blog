"use client";

import { useModal } from "@context/ModalContext";
import { DialogHeader, DialogBody } from "@material-tailwind/react";

const EmailSent = () => {
    const { toggleModal, email, emailModal, setModal } = useModal();

    return (
        <div className="flex flex-col items-center justify-center">
            <DialogHeader className="font-gt-super text-3xl font-normal text-black">
                Check your Inbox
            </DialogHeader>
            <DialogBody className="mt-10 flex items-center flex-col">
                <p className="text-center text-xl max-w-[300px] text-black">
                    Click the link we sent to {email} to{" "}
                    {emailModal == "signin" ? "sign in" : "complete your account set-up"}.
                </p>
                <div className="flex flex-col items-center justify-center mt-3 gap-3">
                    <button
                        className="mt-10 btn-dark px-3 py-2 text-base font-normal w-[56px]"
                        onClick={toggleModal}
                    >
                        Ok
                    </button>
                </div>

                {emailModal == "signin" && (
                    <div className="text-center mt-24 max-w-[500px] text-dark-grey text-[13px]">
                        Can’t use a magic link for some reason? We can{" "}
                        <span
                            className="underline cursor-pointer"
                            onClick={() => {
                                setModal("emailcode");
                            }}
                        >
                            send you a code instead.
                        </span>
                    </div>
                )}
            </DialogBody>
        </div>
    );
};

export default EmailSent;

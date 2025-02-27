"use client";

import { useState } from "react";
import { generateMagicLink } from "@/actions/generateMagicLink";
import { useModal } from "@context/ModalContext";
import { DialogHeader, DialogBody } from "@material-tailwind/react";
import { toast, Toaster } from "react-hot-toast";

const EmailModal = () => {
    const { emailModal, setModal, setEmail } = useModal();
    const [inputEmail, setInputEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (emailRegex.test(inputEmail)) {
            try {
                const response = await generateMagicLink(inputEmail, emailModal);
                if (response.success) {
                    setEmail(inputEmail);
                    setModal("emailsent");
                    setInputEmail("");
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

    return (
        <div className="flex flex-col items-center justify-center">
            <Toaster />
            <DialogHeader className="font-gt-super text-3xl font-normal text-black">
                {emailModal == "signin" ? "Sign in" : "Sign up"} with email
            </DialogHeader>
            <DialogBody className="mt-10">
                <p className="text-center text-xl max-w-[300px] text-black">
                    Enter the email address associated with your account, and we’ll send a magic
                    link to your inbox.
                </p>
                <div className="flex flex-col items-center justify-center mt-10 gap-3">
                    <label htmlFor="emailInput" className="text-black">
                        Your email
                    </label>
                    <input
                        id="emailInput"
                        type="email"
                        value={inputEmail}
                        onChange={(e) => setInputEmail(e.target.value)}
                        className="bg-[#f2f2f2] w-[270px] focus:outline outline-black p-2 focus:bg-[#f9f9f9] text-center text-black rounded font-monospace"
                    />

                    <button
                        className="mt-10 btn-dark px-4 py-2 text-base font-normal w-[226px]"
                        onClick={handleSubmit}
                    >
                        Continue
                    </button>
                </div>

                <div className="flex justify-center items-center mt-10 text-[#1a8917]">
                    <button
                        className="flex items-center gap-1"
                        onClick={() => {
                            setModal(emailModal);
                        }}
                    >
                        <svg width="22" height="22" viewBox="0 0 19 19">
                            <path
                                fillRule="evenodd"
                                fill="#1a8917"
                                d="M11.47 13.969 6.986 9.484 11.47 5l.553.492L8.03 9.484l3.993 3.993z"
                            ></path>
                        </svg>
                        All {emailModal == "signin" ? "sign in" : "sign up"} options
                    </button>
                </div>
            </DialogBody>
        </div>
    );
};

export default EmailModal;

"use client";

import { useModal } from "@context/ModalContext";
import { DialogHeader, DialogBody } from "@material-tailwind/react";
import { useState } from "react";

const EmailCode = () => {
    const { toggleModal, email, emailModal } = useModal();
    const [code, setCode] = useState("");
    const [error, setError] = useState(false);

    const handleChange = (e) => {
        const value = e.target.value;
        setCode(value);

        if (!/^\d{6}$/.test(value)) {
            setError(true);
        } else {
            setError(false);
        }
    };

    const handleCodeSubmit = async () => {
        if (error) return;
        try {
            const res = await fetch("/api/auth/sign-in", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code }),
            });

            const data = await res.json();

            if (res.ok) {
                console.log("Sign-in successful:", data);
                toggleModal();
            } else {
                console.log("Sign-in failed:", data.message);
            }
        } catch (err) {
            console.log("Error signing in:", err);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <DialogHeader className="font-gt-super text-3xl font-normal text-black">
                Check your Inbox
            </DialogHeader>
            <DialogBody className="mt-10 flex items-center flex-col">
                <p className="text-center text-xl max-w-[300px] text-black">
                    Enter the code we sent to {email} to{" "}
                    {emailModal == "signin" ? "sign in" : "sign up"}.
                </p>

                <div className="flex flex-col items-center justify-center mt-10 gap-3">
                    <input
                        type="number"
                        max={999999}
                        value={code}
                        onChange={handleChange}
                        className={`bg-[#f2f2f2] w-[270px] focus:outline outline-black p-2 focus:bg-[#f9f9f9] text-center text-black rounded ${
                            error ? "outline outline-1 outline-red" : ""
                        }`}
                    />
                    {error && (
                        <span className={"text-[#c94a4a] text-[13px] "}>
                            Login code must be 6 digits.
                        </span>
                    )}

                    <button
                        className="mt-10 btn-dark px-3 py-2 text-base font-normal w-[56px]"
                        onClick={handleCodeSubmit}
                        disabled={Boolean(error)}
                    >
                        Ok
                    </button>
                </div>
            </DialogBody>
        </div>
    );
};

export default EmailCode;

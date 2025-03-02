"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUser } from "@/app/(client)/context/UserContext";

const Register = ({ email, token }) => {
    const [fullname, setFullname] = useState(() => (email ? email.split("@")[0] : ""));
    const router = useRouter();
    const { setUser } = useUser();

    const handleSubmit = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    fullname,
                    token,
                }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success("Account created successfully!");
                setUser(data.user);
                setTimeout(() => {
                    router.push("/");
                }, 1500);
            } else {
                console.log(data.error);
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error.message);
            toast.error("Failed to create account. Please try again.");
        }
    };

    return (
        <section className="flex justify-center">
            <div className="px-20 py-32">
                <h1 className="!font-medium text-[32px] text-center font-gt-super mb-4">
                    Almost there!
                </h1>
                <h2 className="!font-normal !text-[15px] text-center text-dark-grey mb-10">
                    Finish creating your account with us.
                </h2>

                <div className="max-w-[420px] flex flex-col items-center gap-2 mb-4">
                    <label htmlFor="fullname" className="text-dark-grey text-[13px]">
                        Full name
                    </label>
                    <input
                        id="fullname"
                        type="text"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                        className="sm:w-[420px] p-2 text-black border-b border-dark-grey focus:outline-none text-[18px]"
                    />
                </div>

                <div className="flex flex-col items-center gap-2 mb-5">
                    <label className="text-dark-grey text-[13px]">Email address</label>
                    <div className="p-2 text-black focus:outline-none text-[18px]">{email}</div>
                </div>
                <div className="flex justify-center items-center">
                    <button className="btn-dark px-5 py-3 text-base" onClick={handleSubmit}>
                        Create account
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Register;

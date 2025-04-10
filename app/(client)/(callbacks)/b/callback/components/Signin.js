"use client";

import { useRouter } from "next/navigation";
import LinkExpired from "../components/modals/LinkExpired";
import AuthError from "../components/modals/AuthError";
import Loading from "../components/loading";
import { Suspense, useEffect, useState } from "react";
import { useUser } from "@/app/(client)/context/UserContext";

const SigninHandler = ({ token }) => {
    const router = useRouter();
    const [status, setStatus] = useState("loading");
    const { setUser } = useUser();

    useEffect(() => {
        let isMounted = true;

        const signIn = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/sign-in`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                if (!isMounted) return;

                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    router.push("/");
                } else if (res.status === 403) {
                    setStatus("expired");
                } else {
                    setStatus("error");
                }
            } catch (error) {
                if (isMounted) setStatus("error");
            }
        };

        signIn();

        return () => {
            isMounted = false;
        };
    }, [router, token]);

    if (status === "loading") return <Loading />;
    if (status === "expired") return <LinkExpired mode="signin" />;
    if (status === "error") return <AuthError mode="signin" />;

    return null;
};

export default function SigninPage(props) {
    return (
        <Suspense fallback={<Loading />}>
            <SigninHandler {...props} />
        </Suspense>
    );
}

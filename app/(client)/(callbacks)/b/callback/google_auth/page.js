"use client";
import { useRouter } from "next/navigation";
import AuthError from "../components/modals/AuthError";
import { useEffect, useState } from "react";
import Loading from "../components/loading";
import { useUser } from "@context/UserContext";

export default function GoogleAuthCallback() {
    const router = useRouter();
    const { setUser } = useUser();
    const [error, setError] = useState(false);

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");

        if (accessToken) {
            verifyTokenWithBackend(accessToken);
        } else {
            console.error("No access token found in URL hash");
            setError(true);
        }
    }, []);

    const verifyTokenWithBackend = async (token) => {
        try {
            // const response = await fetch(
            //     `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
            // );
            // const user = await response.json();

            const res = await fetch("/api/auth/google-auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
                router.push("/");
            } else {
                console.error(res.message);
                setError(true);
            }
        } catch (error) {
            console.error("OAuth error:", error);
            setError(true);
        }
    };

    if (error) return <AuthError mode="signin" />;
    return <Loading />;
}

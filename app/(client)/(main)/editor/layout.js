"use client";

import { EditorProvider } from "@context/EditorContext";
import { useRouter } from "next/navigation";
import { useUser } from "@context/UserContext";
import { useEffect } from "react";

export default function EditorLayout({ children }) {
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!user.access_token) {
            router.push("/m/signin");
        }
    }, [user, router]);

    return <EditorProvider>{children}</EditorProvider>;
}

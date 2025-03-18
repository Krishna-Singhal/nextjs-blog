"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
    const router = useRouter();

    useEffect(() => {
        router.replace("/404");
    }, [router]);

    return (
        <html>
            <body></body>
        </html>
    );
};

export default NotFound;

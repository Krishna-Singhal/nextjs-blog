import { NextResponse } from "next/server";

const allowedOrigins = [process.env.NEXT_PUBLIC_APP_URL];

export function middleware(req) {
    const url = req.nextUrl;
    const hostname = req.headers.get("host");
    const protocol = req.headers.get("x-forwarded-proto") || "http";
    const origin = req.headers.get("origin");

    const domainParts = hostname?.split(".");
    let mainDomain = domainParts.slice(-2).join(".");
    if (hostname?.includes("localhost")) {
        mainDomain = domainParts.at(-1);
    }

    if (hostname?.startsWith("api.")) {
        const res = NextResponse.rewrite(`${protocol}://${mainDomain}/api${url.pathname}`);

        if (allowedOrigins.includes(origin)) {
            res.headers.set("Access-Control-Allow-Origin", origin);
            res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
            res.headers.set("Access-Control-Allow-Credentials", "true");
        }

        return res;
    }

    return NextResponse.next();
}

export const config = {
    matcher: "/:path*",
};

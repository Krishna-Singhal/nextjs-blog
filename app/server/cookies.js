"use server";
import { cookies } from "next/headers";

export async function setCookie(name, value) {
    const cookieStore = await cookies();
    const isLive = process.env.NODE_ENV === "production";

    cookieStore.set(name, typeof value === "object" ? JSON.stringify(value) : value, {
        httpOnly: true,
        secure: isLive,
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
        domain: isLive ? process.env.DOMAIN : undefined,
    });

    return { success: true };
}

export async function getCookies(name) {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.get(name);

    return cookieValue?.value ? JSON.parse(cookieValue.value) : null;
}

export async function removeCookie(name) {
    const cookieStore = await cookies();
    cookieStore.delete(name, { path: "/" });
}

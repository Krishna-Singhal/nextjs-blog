"use server";
import { cookies } from "next/headers";

export async function setCookie(name, value) {
    const cookieStore = await cookies();

    cookieStore.set(name, typeof value === "object" ? JSON.stringify(value) : value, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
    });

    return { success: true };
}

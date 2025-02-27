import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function withAuth(req) {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];

    try {
        const user = jwt.verify(token, process.env.SECRET_ACCESS_KEY);
        req.user = user.id;
        return;
    } catch (err) {
        return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }
}

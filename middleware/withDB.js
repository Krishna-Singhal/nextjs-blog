import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";

export async function withDB(req) {
    try {
        await connectToDB();
        return;
    } catch (error) {
        console.error("Database connection error:", error);
        return NextResponse.json(
            { error: "Database connection failed" },
            { status: 500 }
        );
    }
}

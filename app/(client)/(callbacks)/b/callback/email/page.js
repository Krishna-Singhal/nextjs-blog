import { redirect } from "next/navigation";
import MagicLink from "@/models/MagicLink";
import { connectToDB } from "@/lib/mongodb";
import LinkExpired from "../components/modals/LinkExpired";
import AuthError from "../components/modals/AuthError";
import Register from "../components/Register";
import SigninPage from "../components/Signin";

export default async function EmailCallbackPage({ searchParams }) {
    const { token, mode } = await searchParams;

    if (!token) return redirect("/m/signin");

    await connectToDB();
    const magicLink = await MagicLink.findOne({ token });

    if (!magicLink) {
        console.log("Magic link not found");
        return <AuthError mode={mode} />;
    }

    if (new Date() > new Date(magicLink.expiresAt) || magicLink.used) {
        return <LinkExpired mode={mode} />;
    }

    if (mode === "signin") {
        return <SigninPage token={token} />;
    }

    magicLink.used = true;
    await magicLink.save();

    return <Register email={magicLink.email} token={token} />;
}

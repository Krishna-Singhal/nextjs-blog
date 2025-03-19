import { getCookies } from "@/app/server/cookies";
import Profile from "@components/user/Profile";

async function getProfile(username) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/profile/get?username=${username}`,
            {
                cache: "force-cache",
                next: { revalidate: 300 },
            }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.profile;
    } catch (error) {
        console.warn(error.message);
        return {};
    }
}

async function getUserBlogs(author) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/search?author=${author}`, {
            cache: "force-cache",
            next: { revalidate: 300 },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        return data.blogs;
    } catch (error) {
        console.warn(error.message);
        return [];
    }
}

const ProfilePage = async ({ params }) => {
    let { username } = await params;
    const user = await getCookies("user");
    let profile, blogs;
    if (!user?.access_token) {
        profile = await getProfile(username);
        if (profile?._id) {
            blogs = await getUserBlogs(profile._id);
        }
    }
    return <Profile username={username} initialBlogs={blogs} loadedProfile={profile} />;
};

export default ProfilePage;

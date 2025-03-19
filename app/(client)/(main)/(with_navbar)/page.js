import { getCookies } from "@/app/server/cookies";
import Blogs from "@components/home/Blogs";
import DynamicBlogs from "@components/home/DynamicBlogs";
import TrendingBlogs from "@components/home/TrendingBlogs";
import Link from "next/link";

async function getTabs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tags/trending`, {
            cache: "force-cache",
            next: { revalidate: 3600 },
        });
        if (!res.ok) throw new Error("Failed to fetch tags");

        const data = await res.json();
        const tabs = data.tags.map((tag) => {
            return { name: tag.name, id: tag.slug };
        });
        return [{ name: "for you", id: "for-you" }, ...tabs];
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [{ name: "for you", id: "for-you" }];
    }
}

async function getBlogs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/trending`, {
            cache: "force-cache",
            next: { revalidate: 300 },
        });
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        return data.blogs;
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
}

async function getTrendingBlogs() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/trending`, {
            cache: "force-cache",
            next: { revalidate: 300 },
        });
        if (!res.ok) throw new Error("Failed to fetch trending blogs");

        const data = await res.json();
        return data.blogs;
    } catch (error) {
        console.error("Error fetching trending blogs:", error);
        return [];
    }
}

const recommendedTopics = ["one", "two", "three", "four", "five", "six"];

const Home = async () => {
    const user = await getCookies("user");
    let tabs, blogs, trendingBlogs;
    if (!user?.access_token) {
        [tabs, blogs, trendingBlogs] = await Promise.all([
            getTabs(),
            getBlogs(),
            getTrendingBlogs(),
        ]);
    }

    return (
        <section className="h-cover">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-8">
                    {user?.access_token ? (
                        <DynamicBlogs />
                    ) : (
                        <Blogs tabsArray={tabs} initialBlogs={blogs} />
                    )}
                </div>
                <div className="hidden md:block md:col-span-4 border-l border-grey pl-8 pt-3">
                    <div className="flex flex-col gap-10">
                        <div>
                            <h1 className="font-medium text-xl mb-8">Stories from all interests</h1>
                            <div className="flex flex-wrap gap-3">
                                {recommendedTopics.map((topic, i) => (
                                    <Link href={`/topic/${topic}`} key={i} className="tag">
                                        {topic}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h1 className="font-medium text-xl mb-8">
                                Trending <i className="fi fi-rr-arrow-trend-up"></i>
                            </h1>
                            <TrendingBlogs trendingBlogs={trendingBlogs} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;

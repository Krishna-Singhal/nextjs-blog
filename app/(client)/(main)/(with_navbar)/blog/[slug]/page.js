import Blog from "@components/blog/Blog";
import { getCookies } from "@/app/server/cookies";
import { BlogProvider } from "@context/BlogContext";

const fetchBlog = async ({ slug }) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/get?slug=${slug}`, {
            cache: "force-cache",
            next: { revalidate: 3600 },
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
            throw new Error("Failed to fetch blog");
        }
        return data.blog;
    } catch (error) {
        console.error("Error fetching tags:", error);
        return {};
    }
};

const fetchSimilarBlog = async ({ slug, tags }) => {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/blog/similar?tags=${tags.join(
                ","
            )}&eliminate_blog=${slug}`,
            {
                cache: "force-cache",
                next: { revalidate: 3600 },
            }
        );
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
            throw new Error("Failed to fetch blog");
        }
        return data.blogs;
    } catch (error) {
        console.error("Error fetching tags:", error);
        return [];
    }
};

const BlogPage = async ({ params }) => {
    const { slug } = await params;

    const user = await getCookies("user");
    let blog, similarBlogs;
    if (!user?.access_token) {
        blog = await fetchBlog({ slug });
        if (blog && blog.tags?.length > 0) {
            similarBlogs = await fetchSimilarBlog({
                slug,
                tags: blog.tags.map((tag) => tag._id),
            });
        } else {
            similarBlogs = [];
        }
    }
    return (
        <BlogProvider loadedBlog={blog} loadedSimilarBlogs={similarBlogs} slug={slug}>
            <Blog />
        </BlogProvider>
    );
};

export default BlogPage;

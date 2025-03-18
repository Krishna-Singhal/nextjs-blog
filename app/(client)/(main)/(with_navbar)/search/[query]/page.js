import { BlogSearchResults, ProfileSearchResults } from "@components/search/SearchComponent";
import React from "react";

const SearchPage = async ({ params }) => {
    let { query } = await params;
    query = query ? decodeURIComponent(query) : "";

    return (
        <section className="h-cover">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-8">
                    <h1 className="text-4xl text-dark-grey my-6 font-medium">
                        Results for <span className="text-black text-4xl">{query}</span>
                    </h1>
                    <BlogSearchResults query={query} />
                </div>
                <div className="hidden md:block md:col-span-4 border-l border-grey pl-8 pt-3">
                    <ProfileSearchResults query={query} />
                </div>
            </div>
        </section>
    );
};

export default SearchPage;

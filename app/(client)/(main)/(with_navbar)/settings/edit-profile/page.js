"use client";

import { uploadImage } from "@/app/server/aws";
import AnimationWrapper from "@common/page-animation";
import InputBox from "@components/ui/InputBox";
import ProfileImage from "@components/ui/ProfileImage";
import { useUser } from "@context/UserContext";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

const fetchProfile = async (username) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile/get?username=${username}`);

    if (!res.ok) throw new Error("Profile not found");

    const data = await res.json();
    if (!data.profile || Object.keys(data.profile).length === 0) {
        throw new Error("Empty profile data");
    }

    return data.profile;
};

const useProfile = (username) => {
    return useQuery({
        queryKey: ["profile", username],
        queryFn: () => fetchProfile(username),
        initialData: undefined,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        retry: false,
        enabled: !!username,
    });
};

const profileStructure = {
    personal_info: {
        fullname: "",
        email: "",
        bio: "",
        profile_img: "",
        username: "",
    },
    account_info: {
        total_posts: "",
        total_reads: "",
    },
    social_links: {},
    joinedAt: "",
};

const EditProfilePage = () => {
    const { user, refetchUser } = useUser();

    const { data: profile, isLoading, error: profileError } = useProfile(user.username);
    if (profileError) {
        router.replace("/404");
    }

    let bioLimit = 150;
    let {
        personal_info: { fullname, username: profileUsername, email, bio },
        account_info: { total_posts, total_reads },
        social_links,
        joinedAt,
    } = profile || profileStructure;
    const [charactersLeft, setCharactersLeft] = useState(bioLimit);

    const handleCharacterChange = (e) => {
        const newBio = e.target.value;
        setCharactersLeft(bioLimit - newBio.length);
    };

    const handleImageUpload = (e) => {
        e.preventDefault();
        const img = e.target.files[0];
        if (img) {
            let loadingToast = toast.loading("Uploading...");
            e.target.disabled = true;
            uploadImage("profile-images", img)
                .then(async (url) => {
                    if (url) {
                        const response = await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/profile/update-profile-img`,
                            {
                                method: "POST",
                                headers: { Authorization: "Bearer " + user.access_token },
                                body: JSON.stringify({ url }),
                            }
                        );
                        const res = await response.json();

                        if (!response.ok) throw new Error(res.message);
                        toast.dismiss(loadingToast);
                        toast.success("Uploaded.");
                        refetchUser();
                        e.target.disabled = false;
                    }
                })
                .catch((error) => {
                    toast.dismiss(loadingToast);
                    toast.error(error.message);
                    e.target.disabled = false;
                });
        }
    };

    return (
        <AnimationWrapper>
            {isLoading ? (
                "Loading..."
            ) : (
                <form action="">
                    <h1 className="hidden md:block">Edit Profile</h1>
                    <div className="flex flex-col lg:flex-row items-center py-10 gap-8 lg:gap-10">
                        <div className="center lg:mx-0 mb-5">
                            <label
                                htmlFor="uploadBanner"
                                className="relative block w-48 h-48 overflow-hidden cursor-pointer"
                            >
                                <ProfileImage src={user.profile_img} alt={fullname} />
                                <div className="rounded-full w-full h-full absolute top-0 left-0 flex items-center justify-center to-white bg-black/30 opacity-0 hover:opacity-100 cursor-pointer">
                                    Upload Image
                                </div>
                                <input
                                    id="uploadBanner"
                                    type="file"
                                    accept="images/*"
                                    hidden
                                    onChange={handleImageUpload}
                                />
                            </label>
                        </div>
                        <div className="w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox
                                        name="fullname"
                                        type="text"
                                        value={fullname}
                                        placeholder="Full Name"
                                        disabled={true}
                                        icon="fi-rr-user"
                                    />
                                </div>
                                <div>
                                    <InputBox
                                        name="email"
                                        type="email"
                                        value={email}
                                        placeholder="Email"
                                        disabled={true}
                                        icon="fi-rr-envelope"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <InputBox
                        name="username"
                        type="text"
                        value={profileUsername}
                        placeholder="Username"
                        icon="fi-rr-at"
                    />

                    <p className="text-dark-grey -mt-3">
                        Username will use to search user and will be visible to all users
                    </p>
                    <textarea
                        name="bio"
                        className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5"
                        maxLength={bioLimit}
                        defaultValue={bio}
                        placeholder="Bio"
                        onChange={handleCharacterChange}
                    ></textarea>

                    <p className="mt-1 text-dark-grey">{charactersLeft} characters left</p>

                    <p className="my-6 text-dark-grey">Add your social handles below</p>

                    <div className="md:grid md:grid-cols-2 gap-x-6">
                        {Object.keys(social_links).map((key, i) => {
                            let link = social_links[key];

                            return (
                                <InputBox
                                    key={i}
                                    name={key}
                                    type="text"
                                    value={link}
                                    placeholder="https://"
                                    icon={key != "website" ? "fi-brands-" + key : "fi-rr-globe"}
                                />
                            );
                        })}
                    </div>
                    <button className="btn-dark w-auto px-10" type="submit">
                        Update
                    </button>
                </form>
            )}
        </AnimationWrapper>
    );
};

export default EditProfilePage;

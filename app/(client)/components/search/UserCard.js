import Image from "next/image";
import Link from "next/link";
import React from "react";
import ProfileImage from "@components/ui/ProfileImage";

const UserCard = ({ profile }) => {
    let {
        personal_info: { fullname, username, profile_img },
    } = profile;
    return (
        <Link href={`/user/${username}`} className="flex gap-5 items-center mb-5">
            <div className="min-w-14 min-h-14 max-w-min max-h-min">
                <ProfileImage profile_img={profile_img} fullname={fullname} />
            </div>
            <div>
                <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        </Link>
    );
};

export default UserCard;

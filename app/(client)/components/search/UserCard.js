import Image from "next/image";
import Link from "next/link";
import React from "react";

const UserCard = ({ profile }) => {
    let {
        personal_info: { fullname, username, profile_img },
    } = profile;
    return (
        <Link href={`/user/${username}`} className="flex gap-5 items-center mb-5">
            <div className="min-w-14 min-h-14 max-w-min max-h-min">
                <Image
                    src={profile_img}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover rounded-full"
                    alt={fullname}
                    referrerPolicy="no-referrer"
                />
            </div>
            <div>
                <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        </Link>
    );
};

export default UserCard;

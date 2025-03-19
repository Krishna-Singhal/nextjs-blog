import Image from "next/image";
import React from "react";

const ProfileImage = ({ profile_img, fullname }) => {
    return (
        <>
            {profile_img.includes("api.dicebear.com") ? (
                <img
                    src={profile_img}
                    alt={fullname}
                    className="w-full h-full object-cover rounded-full"
                />
            ) : (
                <Image
                    src={profile_img}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover rounded-full"
                    alt={fullname}
                    referrerPolicy="no-referrer"
                />
            )}
        </>
    );
};

export default ProfileImage;

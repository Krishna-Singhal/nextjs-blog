import Image from "next/image";
import React from "react";

const ProfileImage = ({ src = "", alt = "", className }) => {
    return (
        <>
            {src.includes("api.dicebear.com") ? (
                <img
                    src={src}
                    alt={alt}
                    className={"w-full h-full object-cover rounded-full " + className}
                />
            ) : (
                <Image
                    src={src || "/imgs/user profile.png"}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={"w-full h-full object-cover rounded-full " + className}
                    alt={alt}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                        e.target.onError = null;
                        e.target.src = "/imgs/user profile.png";
                    }}
                />
            )}
        </>
    );
};

export default ProfileImage;

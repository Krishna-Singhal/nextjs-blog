import Image from "next/image";
import React from "react";

const ProfileImage = ({ src, alt }) => {
    return (
        <>
            {src.includes("api.dicebear.com") ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover rounded-full"
                />
            ) : (
                <Image
                    src={src}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="w-full h-full object-cover rounded-full"
                    alt={alt}
                    referrerPolicy="no-referrer"
                />
            )}
        </>
    );
};

export default ProfileImage;

"use client";
import { useUser } from "@/app/(client)/context/UserContext";
import { useModal } from "@context/ModalContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Signin = () => {
    const { toggleModal } = useModal();
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (user.access_token) {
            router.push("/");
            return;
        }
        toggleModal({ modalType: "signin", shouldClose: false });
    }, []);

    return;
};

export default Signin;

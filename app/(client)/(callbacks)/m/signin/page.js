"use client";
import { useModal } from "@context/ModalContext";
import { useEffect } from "react";

const Signin = () => {
    const { toggleModal } = useModal();
    useEffect(() => {
        toggleModal({ modalType: "signin", shouldClose: false });
    }, []);

    return;
};

export default Signin;

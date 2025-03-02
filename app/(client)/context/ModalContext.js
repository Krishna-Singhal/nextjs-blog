"use client";

import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [shouldClose, setShouldClose] = useState(true);
    const [modal, setModal] = useState("signin");
    const [emailModal, setEmailModal] = useState("signin");
    const [email, setEmail] = useState("");

    const toggleModal = ({ modalType = null, shouldClose = true }) => {
        if (typeof modalType == "string") {
            setModal(modalType);
        }
        setShouldClose(shouldClose);
        setOpen((prev) => (modalType != null ? true : !prev));
    };

    return (
        <ModalContext.Provider
            value={{
                open,
                setOpen,
                email,
                setEmail,
                toggleModal,
                modal,
                setModal,
                emailModal,
                setEmailModal,
                shouldClose,
                setShouldClose,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) throw new Error("useModal must be used within ModalProvider");
    return context;
};

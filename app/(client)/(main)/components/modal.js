"use client";
import { Dialog } from "@material-tailwind/react";
import { useModal } from "@context/ModalContext";
import AuthModal from "@modals/auth";
import EmailModal from "@modals/email";
import { useEffect, useRef } from "react";
import EmailSent from "@modals/emailSent";
import EmailCode from "@modals/emailCode";

const Modals = () => {
    const { open, toggleModal, modal, shouldClose } = useModal();
    const modalRef = useRef();

    useEffect(() => {
        if (!modalRef.current) {
            return;
        }
        const modalRefCurrent = modalRef.current;
        if (open) {
            modalRefCurrent.parentElement.classList.add("custom-backdrop");
        } else {
            setTimeout(() => {
                modalRefCurrent.parentElement.classList.remove("custom-backdrop");
            }, 480);
        }
        return () =>
            setTimeout(() => {
                modalRefCurrent.parentElement.classList.remove("custom-backdrop");
            }, 480);
    }, [open, modalRef]);

    return (
        <>
            <Dialog
                ref={modalRef}
                open={open}
                handler={shouldClose ? toggleModal : null}
                dismiss={{ outsidePress: shouldClose }}
                className="m-auto w-screen h-screen md:h-auto md:w-auto max-w-[100%] md:max-w-[650px] !min-w-0 shadow-[0px_2px_10px_rgba(0,0,0,0.15)]"
                animate={{
                    mount: { scale: 0.95, y: 50, opacity: 0, transition: { duration: 0 } },
                    mount: {
                        scale: 1,
                        y: 0,
                        opacity: 1,
                        transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                    },
                    unmount: { scale: 1, y: 0, transition: { duration: 0 } },
                }}
            >
                <div className="relative">
                    {shouldClose && (
                        <div className="absolute top-5 right-6">
                            <button onClick={toggleModal}>
                                <i className="fi fi-rr-cross text-dark-grey"></i>
                            </button>
                        </div>
                    )}
                    <div className="pt-40 md:py-11 px-14 h-full min-h-[600px]">
                        {modal == "signin" ? (
                            <AuthModal />
                        ) : modal == "signup" ? (
                            <AuthModal />
                        ) : modal == "emailauth" ? (
                            <EmailModal />
                        ) : modal == "emailsent" ? (
                            <EmailSent />
                        ) : modal == "emailcode" ? (
                            <EmailCode />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default Modals;

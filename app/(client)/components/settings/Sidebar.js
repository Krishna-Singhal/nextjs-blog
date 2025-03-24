import React, { useEffect, useRef, useState } from "react";
import NavLink from "@components/ui/NavLink";
const Sidebar = ({ children }) => {
    const page = location.pathname.split("/").filter(Boolean).pop();
    const [pageState, setPageState] = useState(page?.replace("-", " "));
    const [showSideNav, setShowSideNav] = useState(false);

    let activeTabLine = useRef();
    let sideBarIconTab = useRef();
    let pageStateTab = useRef();

    const changePageState = (e) => {
        const { offsetWidth, offsetLeft } = e.target;
        activeTabLine.current.style.width = offsetWidth + "px";
        activeTabLine.current.style.left = offsetLeft + "px";

        if (e.target == sideBarIconTab.current) {
            setShowSideNav(true);
        } else {
            setShowSideNav(false);
        }
    };

    useEffect(() => {
        setShowSideNav(false);
        pageStateTab.current.click();
    }, [pageState]);

    return (
        <section className="relative flex gap-10 py-0 m-0 flex-col md:flex-row">
            <div className="sticky top-[60px] z-30">
                <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-x-auto">
                    <button
                        ref={sideBarIconTab}
                        className="p-5 capitalize"
                        onClick={changePageState}
                    >
                        <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                    </button>
                    <button ref={pageStateTab} className="p-5 capitalize" onClick={changePageState}>
                        {pageState}
                    </button>
                    <hr
                        ref={activeTabLine}
                        className="absolute bottom-0 duration-500 bg-black h-[1.8px]"
                    />
                </div>
                <div
                    className={
                        "min-w-[200px] h-[calc(100vh-60px-60px)] md:h-cover md:sticky md:top-24 overflow-y-auto md:p-6 md:pr-0 md:border-grey md:border-r absolute top-[84px] bg-white md:w-full w-[calc(100%+80px)] px-16 md:ml-0 -ml-7 duration-500 md:opacity-100 md:pointer-events-auto " +
                        (!showSideNav ? "opacity-0 pointer-events-none" : "")
                    }
                >
                    <h1 className="text-xl text-dark-grey mb-3">Dashboard</h1>
                    <hr className="border-grey -ml-6 mb-8 mr-6" />

                    <NavLink
                        href={`/dashboard/blogs`}
                        onClick={(e) => {
                            setPageState(e.target.innerText);
                        }}
                        className="sidebar-link"
                    >
                        <i className="fi fi-rr-document"></i>
                        Blogs
                    </NavLink>
                    <NavLink
                        href={`/dashboard/notifications`}
                        onClick={(e) => {
                            setPageState(e.target.innerText);
                        }}
                        className="sidebar-link"
                    >
                        <i className="fi fi-rr-bell"></i>
                        Notifications
                    </NavLink>
                    <NavLink
                        href={`/editor`}
                        onClick={(e) => {
                            setPageState(e.target.innerText);
                        }}
                        className="sidebar-link"
                    >
                        <i className="fi fi-rr-file-edit"></i>
                        Editor
                    </NavLink>

                    <h1 className="text-xl text-dark-grey mt-20 mb-3">Settings</h1>
                    <hr className="border-grey -ml-6 mb-8 mr-6" />

                    <NavLink
                        href={`/settings/edit-profile`}
                        onClick={(e) => {
                            setPageState(e.target.innerText);
                        }}
                        className="sidebar-link"
                    >
                        <i className="fi fi-rr-user"></i>
                        Edit Profile
                    </NavLink>
                </div>
            </div>
            <div className="-mt-8 md:mt-5 w-full">{children}</div>
        </section>
    );
};

export default Sidebar;

import React, { useEffect, useRef, useState } from "react";

const NavigationTabs = ({ tab, setTab, tabs, defaultHidden = [], showSkeleton = false }) => {
    const [showLeftButton, setShowLeftButton] = useState(false);
    const [showRightButton, setShowRightButton] = useState(false);
    const scrollContainerRef = useRef(null);

    useEffect(() => {
        updateScrollButtons();
    }, []);

    const updateScrollButtons = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const scrollThreshold = 10;

        setShowLeftButton(container.scrollLeft > scrollThreshold);
        setShowRightButton(
            container.scrollLeft < container.scrollWidth - container.clientWidth - scrollThreshold
        );
    };

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 720;

            if (!mobile && defaultHidden.includes(tab)) {
                const firstVisibleTab = tabs.find((t) => !defaultHidden.includes(t.id));
                if (firstVisibleTab) {
                    setTab(firstVisibleTab.id);
                }
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [tab, defaultHidden, tabs]);

    const handleScroll = (direction) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const tabsArray = Array.from(container.querySelectorAll("button"));
        if (!tabsArray.length) return;

        let targetTab = null;
        const extraOffset = 5;

        if (direction === "left") {
            for (let i = tabsArray.length - 1; i >= 0; i--) {
                const currentTab = tabsArray[i];
                if (currentTab.offsetLeft < container.scrollLeft) {
                    targetTab = currentTab;
                    break;
                }
            }
            if (targetTab) {
                targetTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
                setTimeout(() => {
                    container.scrollBy({ left: -extraOffset, behavior: "smooth" });
                }, 200);
            } else {
                container.scrollTo({ left: 0, behavior: "smooth" });
            }
        } else {
            for (let i = 0; i < tabsArray.length; i++) {
                const currentTab = tabsArray[i];
                if (
                    currentTab.offsetLeft + currentTab.offsetWidth >
                    container.scrollLeft + container.clientWidth
                ) {
                    targetTab = currentTab;
                    break;
                }
            }
            if (targetTab) {
                targetTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "end" });
                setTimeout(() => {
                    container.scrollBy({ left: extraOffset, behavior: "smooth" });
                }, 200);
            } else {
                container.scrollTo({
                    left: container.scrollWidth - container.clientWidth,
                    behavior: "smooth",
                });
            }
        }

        setTimeout(updateScrollButtons, 300);
    };
    return (
        <div className="relative w-full shadow-[inset_0px_-1px_0px_rgb(242,242,242)]">
            <div
                ref={scrollContainerRef}
                className="px-2 mb-8 overflow-x-auto overflow-y-hidden flex"
                style={{ scrollbarWidth: "none" }}
                onScroll={updateScrollButtons}
            >
                {tabs.map((t) => {
                    return (
                        <button
                            key={t.id}
                            className={
                                "p-4 px-0 mx-4 capitalize duration-300 whitespace-nowrap " +
                                (tab == t.id
                                    ? "text-black border-b border-black "
                                    : "text-dark-grey ") +
                                (defaultHidden.includes(t.id) ? "md:hidden " : " ")
                            }
                            onClick={(e) => {
                                setTab(t.id);
                            }}
                        >
                            {t.name}
                        </button>
                    );
                })}
            </div>
            <div
                className={
                    "bg-[linear-gradient(270deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.75)_25%,rgba(255,255,255,0.9)_50%,rgb(255,255,255)_75%)] pointer-events-none pr-11 absolute top-1/2 -translate-y-1/2 left-0 " +
                    (showLeftButton ? "opacity-1" : " opacity-0")
                }
            >
                <button
                    className="bg-transparent p-0 m-[2px] border-none cursor-pointer pointer-events-auto"
                    onClick={() => handleScroll("left")}
                >
                    <svg width="26px" height="26px" viewBox="0 0 19 19">
                        <path
                            fillRule="evenodd"
                            d="M11.47 13.969 6.986 9.484 11.47 5l.553.492L8.03 9.484l3.993 3.993z"
                        ></path>
                    </svg>
                </button>
            </div>
            <div
                className={
                    "bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,0.75)_25%,rgba(255,255,255,0.9)_50%,rgb(255,255,255)_75%)] pointer-events-none pl-11 absolute top-1/2 -translate-y-1/2 right-0 " +
                    (showRightButton ? "opacity-1" : " opacity-0")
                }
            >
                <button
                    className="bg-transparent p-0 m-[2px] border-none cursor-pointer pointer-events-auto"
                    onClick={() => handleScroll("right")}
                >
                    <svg
                        width="26px"
                        height="26px"
                        viewBox="0 0 19 19"
                        aria-hidden="true"
                        style={{ transform: "rotate(180deg)" }}
                    >
                        <path
                            fillRule="evenodd"
                            d="M11.47 13.969 6.986 9.484 11.47 5l.553.492L8.03 9.484l3.993 3.993z"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default NavigationTabs;

"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import NoDataMessage from "@components/ui/no-data";
import { useUser } from "@context/UserContext";
import NavigationTabs from "@components/ui/NavigationTabs";
import AnimationWrapper from "@common/page-animation";
import NotificationCard from "@components/dashboard/NotificationCard";
import { useNotification } from "@/app/(client)/context/NotificationContext";

const PAGE_SIZE = 10;

async function fetchNotifications({ pageParam = 1, queryKey, access_token }) {
    const [, filter] = queryKey;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/all`, {
        method: "POST",
        headers: { Authorization: "Bearer " + access_token },
        body: JSON.stringify({ page: pageParam, filter }),
    });
    if (!res.ok) {
        throw new Error("Failed to fetch notifications");
    }
    const data = await res.json();
    return {
        notifications: data.notifications,
        nextPage: pageParam + 1,
        isLast: data.notifications.length < PAGE_SIZE,
    };
}

const NotificationsPage = () => {
    const { filter, filters, setFilter, notifications, setNotifications } = useNotification();
    const { user } = useUser();

    const {
        data: notificationsData,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        status,
        error,
    } = useInfiniteQuery({
        queryKey: ["notifications", filter],
        queryFn: ({ pageParam }) =>
            fetchNotifications({
                pageParam,
                queryKey: ["notifications", filter],
                access_token: user?.access_token,
            }),
        getNextPageParam: (lastPage) => (!lastPage.isLast ? lastPage.nextPage : undefined),
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        enabled: !!user?.access_token,
    });

    useEffect(() => {
        if (notificationsData) {
            setNotifications(notificationsData.pages.flatMap((page) => page.notifications));
        }
    }, [notificationsData]);

    const observer = useRef(null);
    const lastNotificationElementRef = useCallback(
        (node) => {
            if (isFetchingNextPage) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasNextPage) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isFetchingNextPage, hasNextPage, fetchNextPage]
    );

    const containerRef = useRef(null);
    useEffect(() => {
        const checkContainerHeight = () => {
            if (
                containerRef.current &&
                containerRef.current.offsetHeight < window.innerHeight &&
                hasNextPage &&
                !isFetchingNextPage
            ) {
                fetchNextPage();
            }
        };
        checkContainerHeight();
        window.addEventListener("resize", checkContainerHeight);
        return () => window.removeEventListener("resize", checkContainerHeight);
    }, [notifications, hasNextPage, isFetchingNextPage, fetchNextPage]);

    return (
        <div>
            <h1 className="hidden md:block text-2xl">Notificatons</h1>
            <div className="my-8 flex gap-6">
                <div ref={containerRef} className="w-full">
                    <NavigationTabs tab={filter} setTab={setFilter} tabs={filters} />

                    {status === "pending" ? (
                        <p>Loading skeleton...</p>
                    ) : status === "error" ? (
                        <p>Error loading notifications: {error.message}</p>
                    ) : notifications?.length ? (
                        <div className="notifications">
                            {notifications.map((notification, index) => {
                                return (
                                    <AnimationWrapper
                                        key={index}
                                        transition={{ duration: 1, delay: index * 0.08 }}
                                        ref={
                                            index == notifications.length - 1
                                                ? lastNotificationElementRef
                                                : null
                                        }
                                    >
                                        <NotificationCard data={notification} index={index} />
                                    </AnimationWrapper>
                                );
                            })}
                        </div>
                    ) : (
                        <NoDataMessage message="No notifications found!" />
                    )}

                    {isFetchingNextPage && <p>Loading more data...</p>}
                    {!hasNextPage &&
                        notificationsData?.pages?.length > 2 &&
                        status !== "pending" && <p>No more notifications available.</p>}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;

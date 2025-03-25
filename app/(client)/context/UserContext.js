"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookies } from "@/app/server/cookies";
import { useQuery } from "@tanstack/react-query";

const UserContext = createContext(null);

export const UserProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser || {});
    const [loading, setLoading] = useState(!initialUser);

    const fetchUser = async () => {
        setLoading(true);
        const userData = await getCookies("user");
        setUser(userData || {});
        setLoading(false);
    };

    const fetchNotifications = async (accessToken) => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notification/new`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data.available;
    };

    const { data: newNotificationsAvailable } = useQuery({
        queryKey: ["notificationsAvailable", user.access_token],
        queryFn: () => fetchNotifications(user.access_token),
        staleTime: 300000,
        cacheTime: 600000,
        enabled: !!user.access_token,
    });

    useEffect(() => {
        if (!initialUser) {
            fetchUser();
        }
    }, [initialUser]);

    return (
        <UserContext.Provider
            value={{ user, loading, setUser, refetchUser: fetchUser, newNotificationsAvailable }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

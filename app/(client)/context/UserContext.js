"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookies } from "@/app/server/cookies";

const UserContext = createContext(null);

export const UserProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);

    const fetchUser = async () => {
        setLoading(true);
        const userData = await getCookies("user");
        setUser(userData || {});
        setLoading(false);
    };

    useEffect(() => {
        if (!initialUser) {
            fetchUser();
        }
    }, [initialUser]);

    return (
        <UserContext.Provider value={{ user, loading, setUser, refetchUser: fetchUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getCookies } from "@/app/server/cookies";

const UserContext = createContext(null);

export const UserProvider = ({ children, initialUser }) => {
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!initialUser);

    useEffect(() => {
        if (!initialUser) {
            const fetchUser = async () => {
                const userData = await getCookies("user");
                setUser(userData);
                setLoading(false);
            };

            fetchUser();
        }
    }, [initialUser]);

    return (
        <UserContext.Provider value={{ user, loading, setUser }}>{children}</UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);

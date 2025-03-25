"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { UserProvider } from "@context/UserContext";

const queryClient = new QueryClient();

export default function Providers({ children, initialUser }) {
    return (
        <QueryClientProvider client={queryClient}>
            <UserProvider initialUser={initialUser}>{children}</UserProvider>
        </QueryClientProvider>
    );
}

"use client";

import Navbar from "@components/navbar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const NavbarLayout = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <Navbar />
            {children}
        </QueryClientProvider>
    );
};

export default NavbarLayout;

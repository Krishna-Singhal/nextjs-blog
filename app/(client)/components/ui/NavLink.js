"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, children, className, onClick }) {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Link href={href} className={className + (isActive ? " active" : "")} onClick={onClick}>
            {children}
        </Link>
    );
}

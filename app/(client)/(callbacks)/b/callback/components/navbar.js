import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="z-10 sticky top-0 flex items-center justify-center gap-12 w-full px-[5vw] py-5 h-[60px] bg-white">
            <Link href="/" className="w-14">
                <Image src="/imgs/logo.png" alt="Logo" width={35} height={44} className="w-full" />
            </Link>
        </nav>
    );
};

export default Navbar;

import Navbar from "@components/navbar";

const NavbarLayout = ({ children }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
};

export default NavbarLayout;

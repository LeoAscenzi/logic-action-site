import Navlink from "./navlink";
import NavDropdown from "./navDropdown";

export default function Navbar() {
    return (
        <div className="flex items-center gap-x-1.5 xl:gap-x-3">
            <Navlink url="/"           text="Home" />
            <Navlink url="/programs"   text="Programs" />
            <Navlink url="/mentors"    text="Mentors" />
            <Navlink url="/community"  text="Community" />
            <Navlink url="/events"     text="Events" />
            <NavDropdown               text="Get Started" />
            <Navlink url="/contact"    text="Contact Us" />
        </div>
    );
}

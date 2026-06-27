import { useTranslations } from "next-intl";
import Navlink from "./navlink";
import NavDropdown from "./navDropdown";

export default function Navbar() {
    const t = useTranslations("navbar");
    return (
        <div className="flex items-center gap-x-3">
            <Navlink url="/"           text={t("home")} />
            <Navlink url="/programs"   text={t("programs")} />
            <Navlink url="/mentors"    text={t("mentors")} />
            <Navlink url="/community"  text={t("community")} />
            <Navlink url="/events"     text={t("events")} />
            <NavDropdown               text={t("getStarted")} />
            <Navlink url="/contact"    text={t("contact")} />
        </div>
    );
}

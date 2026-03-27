import { useTranslations } from "next-intl";
import Link from "next/link";
import Navlink from "./navlink";

export default function Navbar(){
    const t = useTranslations("navbar");
    return (
        <div className="grid grid-cols-4">
            <Navlink url="/mission" text={t('mission')}/>
            <Navlink url="/our-team" text={t('our-team')}/>
            <Navlink url="/programs" text={t('programs')}/>
            <Navlink url="/contact" text={t('contact')}/>
        </div>
    )
}
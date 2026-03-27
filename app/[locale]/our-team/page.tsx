import { useTranslations } from "next-intl"

export default function About(){
    const t = useTranslations('about')
    return <div>{t('title')}</div>
}
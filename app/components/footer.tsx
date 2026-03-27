import { useTranslations } from "next-intl";
import Section from "./section";
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";


export default function Footer(){
    const t = useTranslations('footer');

    return (
        <Section>
            <div className="grid grid-cols-4 h-full">
                <div className="grid justify-center col-start-1 col-span-2 py-8 px-8">
                    <img src="/logo-dark-text-right.png" className="max-h-[124px]"/>
                </div>
                <div className="grid col-start-3 col-span-2 py-8 pr-8 grid-cols-3 border-l-1">
                    <div className="grid col-span-2 items-center justify-center content-center">
                        <div className="grid grid-cols-[auto_1fr] items-center content-start">
                            <MapPinIcon className="size-5 gold-text mr-2"/>
                            <a href="https://maps.app.goo.gl/" target="_blank">{t('address')}</a>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-center content-start">
                            <PhoneIcon className="size-4 gold-text mr-2"/>
                            <a href="tel:1234567890">{t('phone')}</a>
                        </div>
                        <div className="grid grid-cols-[auto_1fr] items-center">
                            <EnvelopeIcon className="size-4 gold-text mr-2"/>
                            <a href={`${t('email')}`}>{t('email')}</a>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 justify-center content-center px-6">
                        <a href="weixin://dl/chat?YOUR_WECHAT_ID" className="hover:opacity-75 transition-opacity">
                            <svg role="img" viewBox="0 0 24 24" className="size-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <title>WeChat</title>
                            <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.11.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.49.49 0 0 1 .177-.554C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.318 2.687c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                            </svg>
                        </a>

                        <a href="https://www.xiaohongshu.com/user/profile/YOUR_XHS_ID" target="_blank" className="hover:opacity-75 transition-opacity">
                            <svg role="img" viewBox="0 0 24 24" className="size-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <title>Xiaohongshu</title>
                            <path d="M17.1135 0H6.8865C3.0615 0 0 3.0615 0 6.8865v10.227C0 20.9385 3.0615 24 6.8865 24h10.227C20.9385 24 24 20.9385 24 17.1135V6.8865C24 3.0615 20.9385 0 17.1135 0zm-3.4275 5.4675h1.341v1.7325h1.7865v1.35h-1.7865v3.105c0 .441.225.666.666.666h1.1205v1.35h-1.422c-1.1025 0-1.707-.6045-1.707-1.7055V8.55h-1.053c-.1665 1.971-1.098 3.33-2.88 4.212l-.756-1.1475c1.4175-.6495 2.214-1.7145 2.3265-3.0645h-2.3535V7.1985h2.376V5.4675h1.341V7.2h.9405l-.0045-1.7325zM8.3925 11.268h6.642v6.2775H8.3925V11.268zm1.35 4.9365h3.942v-3.6h-3.942v3.6z"/>
                            </svg>
                        </a>

                        <a href="https://www.linkedin.com/in/YOUR_LINKEDIN" target="_blank" className="hover:opacity-75 transition-opacity">
                            <svg role="img" viewBox="0 0 24 24" className="size-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                            <title>LinkedIn</title>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </Section>
        )
}
import Button from "@/app/components/button";
import ContactForm from "@/app/components/forms/contactForm";
import Section from "@/app/components/section";

export default function Contact(){
    return (
        <div className='text-center'>
            <Section>
                <div className="grid items-center justify-center gold-text pt-16 emphasis-text text-center">GET IN TOUCH</div>
                <div className="grid items-center justify-center py-5 text-center">
                    <div className="font-playfair tracking-wide text-5xl lg:text-6xl inline">
                        Let's Start Your <span className="gold-text">Journey</span>
                    </div>
                    <div className="grid min-w-[150px] max-w-[100px] border-b-2 pt-8 gold-text mx-auto"></div>
                    <div className="grid py-8 px-2 text-md lg:text-xl max-w-[500px] mx-auto">
                        Whether you're ready to enroll or just have questions, our team is here to guide you every step of the way.
                    </div>
                </div>
            </Section>
            <Section variant="alt">
                <div className="text-center max-w-[70%] lg:max-w-[70%] xl:max-w-[60%] mx-auto py-8">
                    <div className="px-2">
                        <div className="text-left emphasis-text gold-text pb-2 !text-lg">Contact Us</div>
                        <div className="text-left font-inter pb-6">Click above to schedule a free consultation or practice test. We want to match your childs skills to the proper class and give them the education they deserve. Contact us on WeChat, Xiaohongshu or by phone. Do you have any other questions? Send us an email using the form below.</div>
                    </div>
                    <ContactForm/>
                </div>
            </Section>
        </div>
        )
}
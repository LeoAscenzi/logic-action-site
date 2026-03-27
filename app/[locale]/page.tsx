import {useTranslations} from "next-intl";
import Section from "../components/section";
import Button from "../components/button";
import CourseCard from "../components/cards/courseCard";

export default function Home() {
  const t = useTranslations("home");
  return (
    <div>
      <Section>
            <div className="grid content-center justify-items-center py-8 gap-3">
                <div className="grid content-center"><img src="/logo-dark-main.png" className="max-h-[350px]"/></div>
                <div className="grid inline text-4xl font-medium font-playfair">
                  Empowering <span className="gold-text inline">Students to Excel</span>
                </div>
                {/* <Button className="p-4 !font-extrabold cursor-pointer hover:bg-white hover:text-[#D4AF37] border-2 hover:border-[#D4AF37]">Book a Free Consultation</Button> */}
            </div>
        </Section>
        <Section variant="alt" className="!bg-[#EEE8DA]">
          <div className="text-center max-w-[70%] lg:max-w-[70%] xl:max-w-[60%] mx-auto py-8">
            <div className="pb-4">
              <div className="emphasis-text gold-text pb-1 !text-lg">Who We Are</div>
              <div className="font-playfair tracking-wide pb-4 text-3xl lg:text-4xl">Our Mission</div>
              <div className="text-left font-inter">{t("about-blurb")}</div>
              <div className="py-4 border-b-2 border-[#D4AF37] max-w-[300px] mx-auto"></div>
            </div>
            <div className="text-center py-4">
              <div className="emphasis-text gold-text pb-1 !text-lg">What We Offer</div>
              <div className="font-playfair tracking-wide pb-4 text-3xl lg:text-4xl">Our Programs</div>
              <div className="pb-4 text-right"><a href="/programs" className="emphasis-text gold-text underline">View All Programs</a></div>
              <div className="grid grid-cols-3 gap-4" >
                <CourseCard
                  title={t("sat-card.title")}
                  description={t("sat-card.desc")}
                />
                <CourseCard
                  title="AP Courses"
                  description={t("ap-card-desc")}
                />
                <CourseCard
                  title="SSAT Program"
                  description={t("ssat-card-desc")}
                />
              </div>
            </div>
          </div>
        </Section>
    </div>
  );
}

import {useTranslations} from "next-intl";
import Section from "@/app/components/section";
import Button from "@/app/components/button";
import CourseCard from "@/app/components/cards/courseCard";
import { CourseCardType, getCourseCards } from "@/app/lib/getCourseCards";

export default async function Home({params} : {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  const courseCards: CourseCardType[] = await getCourseCards(locale);

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
        <Section variant="alt">
          <div className="text-center max-w-[70%] lg:max-w-[70%] xl:max-w-[60%] mx-auto py-8">
            <div className="pb-4">
              <div className="emphasis-text gold-text pb-1 !text-lg">Who We Are</div>
              <div className="font-playfair tracking-wide pb-4 text-3xl lg:text-4xl">Our Mission</div>
              <div className="text-left font-inter">We do more than teaching - we curate an elite team tailored to your academic goals, from test-prep, school course support, extracurriculars strategy, to college applications. A roadmap customized just for you and an elite team to push you to execute it. Our team is composed of professionals who have walked the path themselves; graduates of prestigious colleges. We share more than knowledge, and also our network and resources, students and alumni, professors, and coaches from Ivy Leagues. Join our community and be connected to people who will help you.</div>
              <div className="py-4 border-b-2 border-[#D4AF37] max-w-[300px] mx-auto"></div>
            </div>
            <div className="text-center py-4">
              <div className="emphasis-text gold-text pb-1 !text-lg">What We Offer</div>
              <div className="font-playfair tracking-wide pb-4 text-3xl lg:text-4xl">Our Programs</div>
              <div className="pb-4 text-right"><a href="/programs" className="emphasis-text gold-text underline">View All Programs</a></div>
              <div className="grid grid-cols-3 gap-4" >
                {courseCards.map((card: CourseCardType, i: number) => {
                  return (<CourseCard key={i} {...card} />)
                })}
              </div>
            </div>
          </div>
        </Section>
    </div>
  );
}

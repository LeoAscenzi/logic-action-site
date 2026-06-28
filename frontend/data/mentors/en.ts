import { Mentor } from "@/app/lib/getMentors";

export const mentors: Mentor[] = [
    {
        name: "Kai",
        major: "Physics & Applied Math",
        school: "Columbia University",
        photo: "/tutors/kai_tutor.png",
        description: "Kai is a Columbia-trained mathematician and physicist with 7 years of experience helping students conquer SATs, APs, and STEM subjects. She excels at breaking down complex problems into clear, simple explanations, and rather than a one-size-fits-all approach, she builds tailored plans that target each student's specific pain points. Her students have earned admission to Columbia, Brown, Cornell, University of Chicago, and more.",
        tags: ["SAT", "College Essays", "AP Calculus"],
    },
    {
        name: "Leo",
        major: "Computer Science, Physics & German",
        school: "Colgate University",
        photo: "/tutors/leo_tutor.png",
        description: "Leo is an accomplished computer scientist with 10 years of teaching experience in computer science, STEM subjects, and SAT prep. Despite high demand, he carves out time to help students craft standout college essays and build the academic foundation that top schools are looking for. He has done great work guiding the next generation to adapt and succeed in the age of AI.",
        tags: ["SSAT", "College Counseling", "AP Computer Science"],
    },
    {
        name: "Matthew",
        major: "Chemistry (PhD)",
        school: "University of Chicago",
        photo: "/tutors/matthew_tutor.png",
        description: "Matthew is a PhD chemist at the University of Chicago and a Fulbright Award recipient with a research background spanning condensed matter, energy systems, and chemical dynamics across institutions in the US and Europe. He brings the same rigorous, first-principles thinking to his students, making chemistry, STEM subjects, and SAT prep approachable and deeply effective.",
        tags: ["SAT", "AP Chemistry", "College Essays"],
    },
];

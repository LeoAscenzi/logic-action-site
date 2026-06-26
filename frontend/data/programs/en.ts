import { Program } from "@/app/lib/getPrograms";

export const programs: Program[] = [
    {
        "title": "SAT Program",
        "description": "Our SAT program is built around the College Board's latest Digital SAT format, combining targeted content instruction with timed practice tests to maximize your score improvement.",
        "facts": [
            "Full coverage of Reading & Writing and Math modules",
            "4 full-length proctored practice tests with detailed review",
            "Proven test-taking strategies and time management drills",
            "Personalized study plan based on diagnostic assessment",
            "Score tracking and progress reports shared with parents",
        ],
        "stats": [
            {
                "label": "Format",
                "value": "Weekly 90-min sessions + bi-weekly full practice tests",
            },
            {
                "label": "Duration",
                "value": "8–16 weeks depending on target test date",
            },
            {
                "label": "Class Size",
                "value": "Small group (4–6 students) or 1-on-1 available",
            }
        ]
    },
    {
        "title": "AP Courses",
        "description": "Earn college credit before graduation. Our AP tutors are subject-matter experts who help students master course content and prepare for the rigorous May exams — targeting scores of 4 or 5.",
        "facts": [
            "Subject-specific tutors matched to each student's course",
            "Curriculum aligned to College Board AP frameworks",
            "Free-response and essay writing practice with feedback",
            "Full AP exam simulations in April leading up to exam season",
        ],
        "stats": [
            {
                "label": "Format",
                "value": "Weekly 60–90 min 1-on-1 or small group sessions",
            },
            {
                "label": "Duration",
                "value": "Full year or intensive spring exam prep (6–8 weeks)",
            },
            {
                "label": "Subjects Offered",
                "value": "Calculus AB/BC, Chemistry, English, Biology",
            }
        ]
    },
    {
        "title": "SSAT Program",
        "description": "The SSAT rewards speed and strategy. Our program focuses on section-specific techniques and pacing so students can confidently work through all four sections within the strict time limits.",
        "facts": [
            "Section-by-section instruction: English, Math, Reading",
            "Timed drills to build speed without sacrificing accuracy",
            "Optional Writing section coaching for schools that require it",
            "SAT vs ACT diagnostic to confirm the right test for each student",
        ],
        "stats": [
            {
                "label": "Format",
                "value": "Weekly 90-min sessions + full-length timed tests",
            },
            {
                "label": "Duration",
                "value": "8–12 weeks leading up to target test date",
            },
            {
                "label": "Class Size",
                "value": "Small group (4–6 students) or 1-on-1 available",
            }
        ]
    },
]

import { Program } from "@/app/lib/getPrograms";

export const programs: Program[] = [
    {
        "title": "SAT Program",
        "slug": "sat-prep",
        "category": "Test Prep",
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
]

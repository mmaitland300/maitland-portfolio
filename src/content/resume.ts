export const contactInfo = {
  name: "Matt Maitland",
  /** Public inbox: set NEXT_PUBLIC_CONTACT_EMAIL for a domain alias; see site-contact helper. */
  location: "Colorado, USA",
  github: "https://github.com/mmaitland300",
};

export type ResumeHighlight = {
  text: string;
  href?: string;
};

export type ResumeExperienceItem = {
  role: string;
  company: string;
  period: string;
  description: string;
  highlights?: ResumeHighlight[];
};

export type ResumeEducationItem = {
  degree: string;
  school: string;
  period: string;
  description?: string;
};

export type ResumeSkillTier = {
  id: "core" | "working" | "familiar";
  title: string;
  skills: string[];
};

export const resumeSummary =
  "Technical support specialist building reliable web tools, audio software, and research prototypes. Full-time I support Full Swing simulator environments through Auxillium—calibration, licensing, display, networking, and Windows behavior—usually with remote diagnosis and incomplete information. Outside of work I build web apps, develop StringFlux (JUCE/C++), and ship research-shaped prototypes like Research Radar, carrying the same habit of naming limits and evidence up front.";

export const resumeSkillTiers: ResumeSkillTier[] = [
  {
    id: "core",
    title: "Core Skills",
    skills: [
      "Troubleshooting",
      "Windows systems",
      "Networking / TCP/IP",
      "TypeScript",
      "Next.js",
      "React",
      "Git / GitHub",
      "Technical communication",
    ],
  },
  {
    id: "working",
    title: "Production / Working",
    skills: [
      "Prisma",
      "PostgreSQL",
      "Auth.js",
      "Tailwind CSS",
      "Python",
      "Flask / Django",
      "Zod",
      "Resend / Upstash",
      "C++",
      "JUCE",
      "DSP",
    ],
  },
  {
    id: "familiar",
    title: "Familiar / Earlier work",
    skills: ["MySQL", "MongoDB", "Machine Learning / CNN", "Apache"],
  },
];

export const resumeExperience: ResumeExperienceItem[] = [
  {
    role: "Independent Software and Audio Development",
    company: "Self-directed",
    period: "2022 - Present",
    description:
      "Self-directed web and audio software with documented tradeoffs and public write-ups—scoped for nights-and-weekends time, solo maintenance, and the same incomplete-information habits as remote support.",
    highlights: [
      {
        text: "Built and shipped mmaitland.dev with typed content, CI, smoke tests, contact validation, rate limiting, and optional admin workflows.",
        href: "https://www.mmaitland.dev",
      },
      {
        text: "Developing StringFlux in JUCE/C++ with focus on real-time-safe behavior, narrow scope, and transparent tradeoffs.",
        href: "https://www.mmaitland.dev/stringflux",
      },
      {
        text: "Publish case studies and decision records so architecture and tradeoffs ship in the same bundle as the demos and repositories.",
      },
    ],
  },
  {
    role: "Technical Support / Product Support Specialist",
    company: "Auxillium (technical support for Full Swing)",
    period: "April 2024 - Present",
    description:
      "Diagnose remote simulator issues across calibration, licensing, display, networking, OS, and peripheral layers in customer production environments.",
    highlights: [
      {
        text: "Built repeatable triage paths for recurring failures so similar tickets reopen the same isolation checklist each time the signature returns.",
        href: "/projects/full-swing-tech-support",
      },
      {
        text: "Support Full Swing-first environments with Laser Shot and E6 Golf from TruGolf often present on the same install.",
      },
    ],
  },
];

export const resumeEducation: ResumeEducationItem[] = [
  {
    degree: "Bachelor's in Biochemistry",
    school: "University of South Florida",
    period: "January 2014 to December 2016",
  },
  {
    degree: "Associate in General Studies",
    school: "Florida Southwestern State College",
    period: "January 2008 to December 2011",
  },
];

export const resumeCertifications = [
  {
    name: "CompTIA A+",
    period: "July 2023 to July 2026",
    description:
      "Validated hands-on skills across hardware, software, networking, troubleshooting, security, mobile devices, and customer support.",
  },
];

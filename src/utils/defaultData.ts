
import { ResumeData } from '../types/resume';

export function getDefaultResumeData(): ResumeData {
  return {
    basics: {
      name: "Sarah Chen",
      label: "Senior Software Engineer",
      image: "",
      email: "sarah.chen@email.com",
      phone: "(555) 123-4567",
      url: "https://sarahchen.dev",
      summary: "Experienced software engineer with 8+ years of expertise in full-stack development, specializing in React, Node.js, and cloud architecture. Passionate about building scalable applications and mentoring junior developers.",
      location: {
        address: "123 Tech Street",
        postalCode: "94105",
        city: "San Francisco",
        countryCode: "US",
        region: "California"
      },
      profiles: [
        {
          network: "LinkedIn",
          username: "sarahchen",
          url: "https://linkedin.com/in/sarahchen",
          visible: true
        },
        {
          network: "GitHub",
          username: "sarahchen",
          url: "https://github.com/sarahchen",
          visible: true
        }
      ]
    },
    work: [
      {
        name: "TechCorp Inc.",
        position: "Senior Software Engineer",
        url: "https://techcorp.com",
        startDate: "2021-03",
        endDate: "",
        summary: "Lead full-stack development of customer-facing applications serving 1M+ users.",
        highlights: [
          "Architected and implemented microservices infrastructure reducing response times by 40%",
          "Led a team of 5 developers in agile development practices",
          "Integrated third-party APIs and payment systems",
          "Mentored 3 junior developers to promotion"
        ],
        visible: true
      },
      {
        name: "StartupXYZ",
        position: "Full Stack Developer",
        url: "https://startupxyz.com",
        startDate: "2019-01",
        endDate: "2021-02",
        summary: "Built core platform features from ground up for B2B SaaS application.",
        highlights: [
          "Developed React-based dashboard with real-time data visualization",
          "Implemented RESTful APIs using Node.js and PostgreSQL",
          "Set up CI/CD pipelines reducing deployment time by 60%",
          "Collaborated with designers to implement responsive UI/UX"
        ],
        visible: true
      }
    ],
    education: [
      {
        institution: "University of California, Berkeley",
        url: "https://berkeley.edu",
        area: "Computer Science",
        studyType: "Bachelor of Science",
        startDate: "2012-08",
        endDate: "2016-05",
        score: "3.8",
        courses: ["Data Structures", "Algorithms", "Database Systems", "Software Engineering"],
        visible: true
      }
    ],
    skills: [
      {
        name: "Programming Languages",
        level: "Expert",
        keywords: ["JavaScript", "TypeScript", "Python", "Java"],
        visible: true
      },
      {
        name: "Frontend Development",
        level: "Expert",
        keywords: ["React", "Next.js", "Vue.js", "HTML5", "CSS3", "Tailwind CSS"],
        visible: true
      },
      {
        name: "Backend Development",
        level: "Advanced",
        keywords: ["Node.js", "Express", "FastAPI", "PostgreSQL", "MongoDB"],
        visible: true
      },
      {
        name: "Cloud & DevOps",
        level: "Intermediate",
        keywords: ["AWS", "Docker", "Kubernetes", "CI/CD", "Git"],
        visible: true
      }
    ],
    projects: [
      {
        name: "Open Source Task Manager",
        description: "A collaborative task management application built with React and Node.js",
        highlights: [
          "1000+ GitHub stars and 200+ contributors",
          "Real-time collaboration using WebSockets",
          "Comprehensive test coverage (95%)"
        ],
        keywords: ["React", "Node.js", "WebSocket", "MongoDB"],
        startDate: "2020-06",
        endDate: "2022-12",
        url: "https://github.com/sarahchen/task-manager",
        roles: ["Creator", "Maintainer"],
        entity: "Personal Project",
        type: "Open Source",
        visible: true
      }
    ],
    awards: [],
    certificates: [
      {
        name: "AWS Certified Solutions Architect",
        date: "2022-08",
        issuer: "Amazon Web Services",
        url: "https://aws.amazon.com/certification/",
        visible: true
      }
    ],
    publications: [],
    languages: [
      {
        language: "English",
        fluency: "Native",
        visible: true
      },
      {
        language: "Mandarin Chinese",
        fluency: "Native",
        visible: true
      }
    ],
    interests: [
      {
        name: "Technology",
        keywords: ["AI/ML", "Web3", "IoT"],
        visible: true
      },
      {
        name: "Outdoor Activities",
        keywords: ["Hiking", "Rock Climbing", "Photography"],
        visible: true
      }
    ],
    references: [],
    volunteer: [],
    sectionVisibility: {
      basics: true,
      work: true,
      education: true,
      skills: true,
      projects: true,
      awards: true,
      certificates: true,
      publications: true,
      languages: true,
      interests: true,
      references: true,
      volunteer: true
    }
  };
}

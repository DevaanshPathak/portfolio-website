export type EducationItem = {
  institution: string
  degree: string
  start: string
  end?: string
  description?: string
  status?: "Completed" | "In Progress" | "Deferred"
  highlights?: string[]
}

export const siteConfig = {
  name: "Devaansh Pathak",
  role: "Python Developer",
  summary:
    "Python developer focused on building reliable backends and APIs with FastAPI/Django. Passionate about writing clean, tested code and deploying with Docker and CI/CD.",
  location: "Your City, Country",

  // IMPORTANT: set this to your GitHub username to auto-load projects
  githubUsername: "DevaanshPathak",

  // If present, the site will show these as "Featured Projects" instead of auto-loading recent repos.
  pinnedRepos: [
    // Examples (you can delete these and put your own):
    // "https://github.com/DevaanshPathak/some-repo",
    // { url: "https://github.com/DevaanshPathak/fastapi-starter", label: "FastAPI Starter", description: "Production-ready FastAPI boilerplate" },

    "https://github.com/DevaanshPathak/TechLang",
  ],

  certificates: [
    // Example objects (replace with real data or leave empty):
    // {
    //   title: "Algorithms Specialization",
    //   issuer: "Coursera",
    //   date: "Jun 2024",
    //   credentialUrl: "https://coursera.org/verify/ABC123",
    //   skills: ["Algorithms", "Data Structures", "Complexity"],
    //   image: "/coursera-certificate.png",
    // },
  ],

  coursework: [
    // { title: "Data Structures & Algorithms", institution: "Your College", details: "Lists, trees, graphs, DP" },
    // { title: "Databases", institution: "Your College", details: "SQL, normalization, transactions" },
  ],

  achievements: [
    // { title: "Hackathon Winner", event: "XYZ Hack 2024", date: "2024", details: "Built a FastAPI service..." },
    // { title: "Open-source Contributor", event: "GitHub", date: "2024", details: "Contributed to ..." },
  ],

  education: [] as EducationItem[],

  // Fastfetch profile configuration
  fastfetch: {
    os: "Portfolio OS",
    host: "devaansh-dev",
    kernel: "Node.js 20.x",
    uptime: "Always Online",
    packages: "npm (1337 packages)",
    shell: "bash 5.1.8",
    resolution: "Responsive",
    theme: "Dark/Light Auto",
    icons: "Lucide React",
    terminal: "Interactive Web Terminal",
    cpu: "Python Engine",
    gpu: "CSS Animations",
    memory: "Optimized for Performance",
    disk: "Cloud Storage",
    localip: "127.0.0.1",
    publicip: "Fly.dev",
    battery: "Powered by Coffee ☕",
    locale: "en_US.UTF-8"
  },

  seo: {
    url: "https://your-domain.com",
    title: "Devaansh Pathak — Python Developer",
    description:
      "Python developer focused on reliable backends and APIs with FastAPI/Django. Clean, tested code and CI/CD.",
  },

  links: {
    github: "https://github.com/DevaanshPathak",
    linkedin: "https://www.linkedin.com/in/your-linkedin/",
    email: "mailto:devaanshpathak08@gmail.com",
    resume: "/resume.pdf",
  },
} as const

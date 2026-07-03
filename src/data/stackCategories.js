const ICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

export const stackFilters = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Database" },
  { id: "devops", label: "DevOps" },
  { id: "tools", label: "Tools & Others" },
];

export const stackCategories = [
  {
    id: "frontend",
    number: "01",
    title: "Frontend",
    description:
      "Crafting interactive, responsive, and visually stunning user interfaces with modern frontend technologies.",
    items: [
      "TypeScript",
      "Next.js",
      "React.js",
      "Tailwind CSS",
      "Redux Toolkit",
      "Framer Motion",
      "HTML5 / CSS3",
      "JavaScript (ES6+)",
    ],
    logos: [
      {
        name: "TypeScript",
        src: `${ICON}/typescript/typescript-original.svg`,
        glow: "rgba(49, 120, 198, 0.45)",
      },
      {
        name: "Next.js",
        src: `${ICON}/nextjs/nextjs-original.svg`,
        glow: "rgba(255, 255, 255, 0.35)",
      },
      {
        name: "React",
        src: `${ICON}/react/react-original.svg`,
        glow: "rgba(97, 218, 251, 0.4)",
      },
      {
        name: "Tailwind CSS",
        src: `${ICON}/tailwindcss/tailwindcss-original.svg`,
        glow: "rgba(56, 189, 248, 0.4)",
      },
      {
        name: "Redux",
        src: `${ICON}/redux/redux-original.svg`,
        glow: "rgba(118, 74, 188, 0.45)",
      },
      {
        name: "Framer Motion",
        src: "https://cdn.simpleicons.org/framer/0055FF",
        glow: "rgba(0, 85, 255, 0.4)",
      },
      {
        name: "HTML5",
        src: `${ICON}/html5/html5-original.svg`,
        glow: "rgba(227, 79, 38, 0.4)",
      },
      {
        name: "JavaScript",
        src: `${ICON}/javascript/javascript-original.svg`,
        glow: "rgba(247, 223, 30, 0.35)",
      },
    ],
  },
  {
    id: "backend",
    number: "02",
    title: "Backend",
    description:
      "Building robust APIs and server-side logic with powerful and scalable backend technologies.",
    items: [
      "Node.js",
      "Express.js",
      "NestJS",
      "REST APIs",
      "GraphQL",
      "JWT / Auth",
      "Socket.io",
    ],
    logos: [
      {
        name: "Node.js",
        src: `${ICON}/nodejs/nodejs-original.svg`,
        glow: "rgba(51, 153, 51, 0.42)",
      },
      {
        name: "Express",
        src: `${ICON}/express/express-original.svg`,
        glow: "rgba(255, 255, 255, 0.28)",
      },
      {
        name: "NestJS",
        src: `${ICON}/nestjs/nestjs-plain.svg`,
        glow: "rgba(233, 30, 99, 0.4)",
      },
      {
        name: "GraphQL",
        src: `${ICON}/graphql/graphql-plain.svg`,
        glow: "rgba(225, 0, 152, 0.4)",
      },
      {
        name: "JWT",
        src: "https://cdn.simpleicons.org/jsonwebtokens/000000",
        glow: "rgba(255, 255, 255, 0.22)",
      },
      {
        name: "Socket.io",
        src: `${ICON}/socketio/socketio-original.svg`,
        glow: "rgba(255, 255, 255, 0.3)",
      },
    ],
  },
  {
    id: "database",
    number: "03",
    title: "Database",
    description:
      "Storing, managing and querying data efficiently with modern database solutions.",
    items: ["MongoDB", "PostgreSQL", "MySQL", "Prisma ORM", "Mongoose"],
    logos: [
      {
        name: "MongoDB",
        src: `${ICON}/mongodb/mongodb-original.svg`,
        glow: "rgba(71, 162, 72, 0.42)",
      },
      {
        name: "PostgreSQL",
        src: `${ICON}/postgresql/postgresql-original.svg`,
        glow: "rgba(51, 103, 145, 0.45)",
      },
      {
        name: "MySQL",
        src: `${ICON}/mysql/mysql-original.svg`,
        glow: "rgba(0, 117, 143, 0.42)",
      },
      {
        name: "Prisma",
        src: `${ICON}/prisma/prisma-original.svg`,
        glow: "rgba(45, 212, 191, 0.35)",
      },
      {
        name: "Mongoose",
        src: "https://cdn.simpleicons.org/mongoose/880000",
        glow: "rgba(136, 0, 0, 0.35)",
      },
    ],
  },
  {
    id: "devops",
    number: "04",
    title: "DevOps & Deployment",
    description:
      "Automating, deploying and scaling applications with industry-standard DevOps tools.",
    items: [
      "Docker",
      "Nginx",
      "Vercel",
      "GitHub Actions",
      "AWS (S3, EC2)",
      "CI/CD",
    ],
    logos: [
      {
        name: "Docker",
        src: `${ICON}/docker/docker-original.svg`,
        glow: "rgba(36, 150, 237, 0.42)",
      },
      {
        name: "Nginx",
        src: `${ICON}/nginx/nginx-original.svg`,
        glow: "rgba(0, 150, 57, 0.4)",
      },
      {
        name: "Vercel",
        src: `${ICON}/vercel/vercel-original.svg`,
        glow: "rgba(255, 255, 255, 0.32)",
      },
      {
        name: "GitHub Actions",
        src: `${ICON}/github/github-original.svg`,
        glow: "rgba(255, 255, 255, 0.28)",
      },
      {
        name: "AWS",
        src: `${ICON}/amazonwebservices/amazonwebservices-plain-wordmark.svg`,
        glow: "rgba(255, 153, 0, 0.38)",
      },
    ],
  },
  {
    id: "tools",
    number: "05",
    title: "Tools & Others",
    description:
      "Essential tools and utilities that speed up development and improve productivity.",
    items: [
      "Git & GitHub",
      "VS Code",
      "Postman",
      "Figma",
      "ESLint",
      "Prettier",
    ],
    logos: [
      {
        name: "Git",
        src: `${ICON}/git/git-original.svg`,
        glow: "rgba(240, 80, 50, 0.4)",
      },
      {
        name: "GitHub",
        src: `${ICON}/github/github-original.svg`,
        glow: "rgba(255, 255, 255, 0.28)",
      },
      {
        name: "VS Code",
        src: `${ICON}/vscode/vscode-original.svg`,
        glow: "rgba(0, 122, 204, 0.42)",
      },
      {
        name: "Postman",
        src: `${ICON}/postman/postman-original.svg`,
        glow: "rgba(255, 108, 55, 0.4)",
      },
      {
        name: "Figma",
        src: `${ICON}/figma/figma-original.svg`,
        glow: "rgba(242, 78, 30, 0.38)",
      },
      {
        name: "ESLint",
        src: `${ICON}/eslint/eslint-original.svg`,
        glow: "rgba(75, 85, 255, 0.42)",
      },
      {
        name: "Prettier",
        src: `${ICON}/prettier/prettier-original.svg`,
        glow: "rgba(247, 154, 167, 0.38)",
      },
    ],
  },
];

export const logoLayoutPresets = [
  { top: "10%", left: "6%", rotate: -14, z: 2 },
  { top: "24%", left: "34%", rotate: 8, z: 4 },
  { top: "8%", left: "62%", rotate: -6, z: 3 },
  { top: "46%", left: "14%", rotate: 11, z: 5 },
  { top: "40%", left: "48%", rotate: -9, z: 6 },
  { top: "54%", left: "70%", rotate: 6, z: 4 },
  { top: "68%", left: "28%", rotate: -7, z: 3 },
  { top: "72%", left: "58%", rotate: 12, z: 2 },
];

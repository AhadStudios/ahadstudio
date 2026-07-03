import { projects } from "@/data/projects";

export const HOME_HOVER_STEPS = [
  ["HEY,", "I'M AHAD"],
  ["20YO"],
  ["FULL STACK DEVELOPER"],
  ["3+ YEARS EXPERIENCE"],
];

export const WORK_HOVER_PROJECTS = projects.filter((project) =>
  ["ORBIT", "ECHO", "LUMINA", "NEXUS"].includes(project.title),
);

export const WORK_HOVER_ENTRIES = [
  { x: -120, y: 60, rotation: -6 },
  { x: 110, y: -40, rotation: 5 },
  { x: -90, y: -70, rotation: -4 },
  { x: 100, y: 80, rotation: 7 },
];

export const STACK_HOVER_TECH = [
  {
    id: "react",
    label: "React",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    id: "nextjs",
    label: "Next.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
  },
  {
    id: "nodejs",
    label: "Node.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    id: "gsap",
    label: "GSAP",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/gsap/gsap-original.svg",
  },
  {
    id: "threejs",
    label: "Three.js",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg",
  },
  {
    id: "typescript",
    label: "TypeScript",
    src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
  },
];

export const STACK_HOVER_POSITIONS = [
  { left: "18%", top: "28%" },
  { left: "42%", top: "18%" },
  { left: "68%", top: "32%" },
  { left: "24%", top: "58%" },
  { left: "54%", top: "52%" },
  { left: "72%", top: "68%" },
];

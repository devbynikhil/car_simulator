import * as THREE from "three/webgpu";

const text = `
███╗   ██╗██╗██╗  ██╗██╗██╗     ██╗  ██╗██╗   ██╗███╗   ███╗ █████╗ ██████╗ 
████╗  ██║██║██║ ██╔╝██║██║     ██║ ██╔╝██║   ██║████╗ ████║██╔══██╗██╔══██╗
██╔██╗ ██║██║█████╔╝ ██║██║     █████╔╝ ██║   ██║██╔████╔██║███████║██████╔╝
██║╚██╗██║██║██╔═██╗ ██║██║     ██╔═██╗ ██║   ██║██║╚██╔╝██║██╔══██║██╔══██╗
██║ ╚████║██║██║  ██╗██║███████╗██║  ██╗╚██████╔╝██║ ╚═╝ ██║██║  ██║██║  ██║
╚═╝  ╚═══╝╚═╝╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝

  ██████╗ █████╗ ██████╗     ██████╗ ██████╗ ██╗██╗   ██╗███████╗
██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔══██╗██║██║   ██║██╔════╝
██║     ███████║██████╔╝    ██║  ██║██████╔╝██║██║   ██║█████╗  
██║     ██╔══██║██╔══██╗    ██║  ██║██╔══██╗██║╚██╗ ██╔╝██╔══╝  
╚██████╗██║  ██║██║  ██║    ██████╔╝██║  ██║██║ ╚████╔╝ ███████╗
 ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝  ╚══════╝

╔═ Intro ═══════════════╗
║ Hey developer 👀
║ Welcome to the Car Simulator built by Nikhil Kumar.
║ This interactive 3D experience showcases a physics-driven
║ vehicle system built using modern WebGL / WebGPU technologies.
╚═══════════════════════╝

╔═ About Me ════════════╗
║ Name        ⇒ Nikhil Kumar
║ Role        ⇒ Full Stack Software Engineer
║ Education   ⇒ B.Tech CSE (Computer Science & Design)
║ Focus       ⇒ Web Development, Systems, AI/ML
║ Stack       ⇒ React, Next.js, Node.js, TypeScript, MongoDB
╚═══════════════════════╝

╔═ Socials ═════════════╗
║ Email        ⇒ nk10nikhil@gmail.com
║ GitHub       ⇒ https://github.com/nk10nikhil
║ LinkedIn     ⇒ https://linkedin.com/in/nk10nikhil
║ Portfolio    ⇒ https://www.nk10nikhil.dev
║ LeetCode     ⇒ https://leetcode.com/u/nk10nikhil/
║ Twitter/X    ⇒ https://x.com/nk10nikhil_
║ Telegram     ⇒ https://t.me/nk10nikhil
╚═══════════════════════╝

╔═ Projects ════════════╗
║ • E-commerce Platform (Razorpay + JWT)
║ • QR Event Ticketing System (SIH Project)
║ • Predictive Analytics Dashboard
║ • Real-Time Chat Application
║ • Everyday Life E-Commerce
║ • Restaurant Booking Platform
║ • AI SaaS & Automation Projects
╚═══════════════════════╝

╔═ Debug ═══════════════╗
║ Add #debug at the end of the URL to enable debug mode.
║ Press [V] to toggle free camera.
╚═══════════════════════╝

╔═ Controls ════════════╗
║ W / ↑  ⇒ Accelerate
║ S / ↓  ⇒ Brake / Reverse
║ A / ←  ⇒ Turn Left
║ D / →  ⇒ Turn Right
║ V      ⇒ Toggle Free Camera
╚═══════════════════════╝

╔═ Three.js ════════════╗
║ This portfolio runs on Three.js (release: ${THREE.REVISION})
║ https://threejs.org/
║ Rendering powered by WebGL / WebGPU and modern browser APIs.
╚═══════════════════════╝

╔═ Tech Stack ══════════╗
║ Frontend   ⇒ React, Next.js, Tailwind
║ Backend    ⇒ Node.js, Express, Django
║ Databases  ⇒ MongoDB, PostgreSQL, MySQL
║ Cloud      ⇒ AWS, Azure, OCI, Vercel
║ DevOps     ⇒ Docker, CI/CD, GitHub Actions
╚═══════════════════════╝

╔═ Source Code ═════════╗
║ Portfolio source code available on GitHub.
║ Feel free to explore, learn, and build upon it.
║ https://github.com/nk10nikhil
╚═══════════════════════╝

╔═ Libraries ═══════════╗
║ Three.js        ⇒ https://threejs.org/
║ Rapier Physics  ⇒ https://rapier.rs/
║ Howler.js       ⇒ https://howlerjs.com/
║ GSAP            ⇒ https://gsap.com/
║ Framer Motion   ⇒ https://www.framer.com/motion/
╚═══════════════════════╝
`;

let finalText = "";
let finalStyles = [];

const stylesSet = {
  letter: "color: #ffffff; font: 400 1em monospace;",
  pipe: "color: #D66FFF; font: 400 1em monospace;",
};

let currentStyle = null;

for (let i = 0; i < text.length; i++) {
  const char = text[i];

  const style = char.match(/[╔║═╗╚╝╔╝]/) ? "pipe" : "letter";

  if (style !== currentStyle) {
    currentStyle = style;
    finalText += "%c";
    finalStyles.push(stylesSet[currentStyle]);
  }

  finalText += char;
}

export default [finalText, ...finalStyles];

/**
 * portfolioData.js
 * Single source of truth for both the visual portfolio and the CLI terminal.
 * Components import from here instead of defining data inline.
 */

export const IDENTITY = {
  name: 'Tushar Khatiwada',
  handle: 'walkinguy',
  role: 'Full Stack Dev & ML Enthusiast',
  roles: ['Full Stack Dev', 'ML Enthusiast', 'Problem Solver', 'CS Student'],
  location: 'Kathmandu, Nepal',
  university: 'Himalaya College of Engineering, Lalitpur',
  year: '3rd Year Computer Engineering',
  email: 'walkinguy1937@gmail.com',
  github: 'https://github.com/walkinguy1',
  githubUsername: 'walkinguy1',
  linkedin: 'https://linkedin.com/in/tushar-khatiwada',
  instagram: 'https://instagram.com/walkinguy',
  bio: [
    "I'm a 3rd year Computer Engineering student at Himalaya College of Engineering, Lalitpur.",
    "My main interests are web development and machine learning. I'm curious about most things in tech and pick up new areas whenever a good problem comes along.",
    "Outside of code I go by Walkinguy online. The handle fits how I learn: one step at a time.",
  ],
};

/**
 * Every entry here must be verifiable by a visitor in under a minute:
 * `githubUrl` must resolve, `tech` must reflect what is actually in the repo,
 * and `description` must state what the project does today — not what it will do.
 *
 * `status`   — 'shipped' | 'working-prototype' | 'in-progress' | 'paused'
 * `builtFor` — 'coursework' | 'personal' | 'client' | 'hackathon'
 */
export const PROJECTS = [
  {
    slug: 'zappstore',
    title: 'ZappStore',
    description:
      'A full e-commerce store with product catalog, cart, orders, payments, wishlists, and reviews. React front end backed by a Django REST API.',
    tech: ['React', 'Django', 'Zustand', 'SQLite'],
    githubUrl: 'https://github.com/walkinguy1/Web-Application-Programming-Project',
    liveUrl: 'https://zappstore-jade.vercel.app',
    status: 'shipped',
    builtFor: 'coursework',
    year: '2025',
  },
  {
    // Team minor project — the repo lives on a teammate's account, and the
    // README names all four submitters, so the collaborator claim is checkable.
    slug: 'medalert-nepal',
    title: 'MedAlert Nepal',
    description:
      'A mobile-first emergency health app for Nepal: find pharmacies with medicine in stock, locate blood banks by blood group, reach ambulance providers, and carry a digital medical ID. Prescription photos are read with Gemini vision. Built as a four-person minor project; core system is functional end to end.',
    tech: ['Flutter', 'Django REST', 'Gemini API', 'JWT'],
    githubUrl: 'https://github.com/AlishxAdhikari/Medicine-Availability-Emergency-Finder',
    liveUrl: null,
    status: 'working-prototype',
    builtFor: 'coursework',
    year: '2026',
    role: 'Collaborator — 4-person team',
  },
  {
    slug: 'gesture-platform',
    title: 'Gesture Platform',
    description:
      'Real-time sign language recognition: a Python hand-tracking engine, a training pipeline, and a desktop app that talks to it over a local WebSocket bridge. ASL fingerspelling works today; dynamic signs and BSL are scaffolded but need training data.',
    tech: ['Python', 'React', 'Tauri', 'WebSocket'],
    githubUrl: 'https://github.com/walkinguy1/gesture-platform',
    liveUrl: null,
    status: 'working-prototype',
    builtFor: 'personal',
    year: '2026',
  },
  {
    slug: 'khoja',
    title: 'Khoja',
    description:
      'A lost-and-found system for tourists in Nepal, built with a team for the Nepal Tourism Hackathon. The Supabase backend is complete.',
    tech: ['JavaScript', 'TypeScript', 'Supabase'],
    githubUrl: 'https://github.com/walkinguy1/Khoja-Lost-and-Found-System',
    liveUrl: null,
    status: 'working-prototype',
    builtFor: 'hackathon',
    year: '2026',
  },
  {
    slug: 'vellum',
    title: 'Vellum',
    description:
      'A study tool built around a Gemini-powered PDF analyzer, with a Pomodoro timer and to-do list alongside it. A background sound creator is built but not yet fully integrated.',
    tech: ['JavaScript', 'Python', 'Gemini API'],
    githubUrl: 'https://github.com/walkinguy1/Vellum-pdf-analyzer-tool-for-learning',
    liveUrl: null,
    status: 'in-progress',
    builtFor: 'personal',
    year: '2026',
  },
  {
    // The repo is named Rubiks; the project inside it is OmniSolve.
    slug: 'omnisolve',
    title: 'OmniSolve',
    description:
      'A twisty puzzle solver covering cubes from 2x2 to 5x5 plus the Pyraminx and Skewb. Scramble or paint a puzzle, then step through the solution one move at a time in a 3D view. Cube solutions use human methods, layer-by-layer and reduction, so every move belongs to a named step instead of coming out of a lookup table; they run longer than an optimal solve, which is the deliberate trade. The Pyraminx and Skewb are small enough to solve outright, so both get a shortest solution found by meeting in the middle. The solvers and the state model are covered by tests.',
    tech: ['React', 'Three.js', 'JavaScript', 'Jest'],
    githubUrl: 'https://github.com/walkinguy1/Rubiks',
    liveUrl: null,
    status: 'working-prototype',
    builtFor: 'personal',
    year: '2026',
  },
  {
    slug: 'walkerchat',
    title: 'WalkerChat',
    description:
      'A realtime chat platform with a FastAPI backend: persistent WebSockets over Redis Pub/Sub, Celery for background work, encrypted media uploads to S3-compatible storage, and WebRTC signalling for peer-to-peer audio and video. Message bodies are stored as ciphertext, but the client-side key exchange is still an experimental AES-GCM demo rather than a full Signal-style implementation with a double ratchet and real key management.',
    tech: ['TypeScript', 'FastAPI', 'Redis', 'WebRTC'],
    githubUrl: 'https://github.com/walkinguy1/WalkerChat',
    liveUrl: null,
    status: 'in-progress',
    builtFor: 'personal',
    year: '2026',
  },
];

export const SKILL_TIERS = [
  {
    tier: 'Currently Using',
    blurb: "My daily drivers — what I reach for on most projects right now.",
    skills: [
      { name: 'React',         category: 'Frontend' },
      { name: 'JavaScript',    category: 'Frontend' },
      { name: 'HTML & CSS',    category: 'Frontend' },
      { name: 'Bootstrap',     category: 'Frontend' },
      { name: 'FastAPI',        category: 'Backend & APIs' },
      { name: 'Django',        category: 'Backend & APIs' },
      { name: 'Flutter & Dart', category: 'Mobile' },
      { name: 'Supabase',      category: 'Backend & APIs' },
      { name: 'Jupyter Notebook',    category: 'ML & Data' },
      { name: 'Gemini API',    category: 'ML & Data' },
      { name: 'Git & GitHub',  category: 'Tools' },
      { name: 'Pygame',        category: 'Tools' },
    ],
  },
  {
    tier: 'Comfortable With',
    blurb: 'Solid working knowledge — used in real projects, still sharpening.',
    skills: [
      { name: 'Django & DRF',  category: 'Backend & APIs' },
      { name: 'FastAPI',       category: 'Backend & APIs' },
      { name: 'REST APIs',     category: 'Backend & APIs' },
      { name: 'TypeScript',    category: 'Frontend' },
      { name: 'JavaScript',    category: 'Frontend' },
      { name: 'Pandas',        category: 'ML & Data' },
      { name: 'NumPy',         category: 'ML & Data' },
      { name: 'Linux / CLI',   category: 'Tools' },
    ],
  },
  {
    tier: 'Exploring & Learning',
    blurb: 'Actively learning — built things with these and going deeper.',
    skills: [
      { name: 'SQL',               category: 'Backend & APIs' },
      { name: 'Scikit-learn',      category: 'ML & Data' },
      { name: 'Tauri',             category: 'Tools' },
      { name: 'Matplotlib',        category: 'ML & Data' },
      { name: 'Figma / UI Design', category: 'Design' },
    ],
  },
];

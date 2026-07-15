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
    "My main interests are web development and machine learning — but I'm genuinely curious about most things in tech and love diving into new areas whenever a good problem comes along.",
    "Outside of code, you'll find me as Walkinguy across online spaces — a handle that kind of captures how I move through learning: one step at a time, persistently.",
  ],
};

export const PROJECTS = [
  {
    slug: 'vellum',
    title: 'Vellum',
    description: 'A modern document collaboration platform with real-time editing, version control, and team collaboration features. Built with a focus on performance and user experience.',
    tech: ['React', 'Node.js', 'WebSocket', 'MongoDB'],
    githubUrl: 'https://github.com/walkinguy1/vellum',
    liveUrl: null,
    imgKey: 'projImg1',
  },
  {
    slug: 'amigosync',
    title: 'AmigoSync',
    description: 'Synchronization and backup utility that seamlessly keeps files across multiple devices in sync. Features conflict resolution, selective sync, and bandwidth optimization.',
    tech: ['Electron', 'Node.js', 'React', 'SQLite'],
    githubUrl: 'https://github.com/walkinguy1/amigosync',
    liveUrl: null,
    imgKey: 'projImg2',
  },
  {
    slug: 'khoja',
    title: 'Khoja',
    description: 'E-commerce platform tailored for local markets with multi-vendor support, inventory management, and payment gateway integration. Designed for scalability and ease of use.',
    tech: ['Next.js', 'PostgreSQL', 'Stripe', 'Redis'],
    githubUrl: 'https://github.com/walkinguy1/khoja',
    liveUrl: null,
    imgKey: 'projImg3',
  },
  {
    slug: 'medalert-nepal',
    title: 'MedAlert Nepal',
    description: 'Healthcare alert system for medical facilities in Nepal, providing real-time notifications for critical patient data, medicine stock levels, and emergency responses.',
    tech: ['Flutter', 'FastAPI', 'PostgreSQL', 'Twilio'],
    githubUrl: 'https://github.com/walkinguy1/medalert-nepal',
    liveUrl: null,
    imgKey: 'projImg1',
  },
  {
    slug: 'studyforge',
    title: 'StudyForge',
    description: 'Interactive learning platform with spaced repetition, progress tracking, and collaborative study tools. Helps students optimize their learning schedules and retain information effectively.',
    tech: ['Vue.js', 'Python', 'Django', 'Celery'],
    githubUrl: 'https://github.com/walkinguy1/studyforge',
    liveUrl: null,
    imgKey: 'projImg2',
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
      { name: 'Python',        category: 'Backend & APIs' },
      { name: 'Git & GitHub',  category: 'Tools' },
      { name: 'Pygame',        category: 'Tools' },
    ],
  },
  {
    tier: 'Comfortable With',
    blurb: 'Solid working knowledge — used in real projects, still sharpening.',
    skills: [
      { name: 'FastAPI',       category: 'Backend & APIs' },
      { name: 'REST APIs',     category: 'Backend & APIs' },
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
      { name: 'Matplotlib',        category: 'ML & Data' },
      { name: 'Figma / UI Design', category: 'Design' },
    ],
  },
];

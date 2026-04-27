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
    slug: 'car-price-prediction',
    title: 'Car Price Prediction Model',
    description: 'ML model that predicts car prices based on features like brand, mileage, fuel type, and age using regression techniques in Python.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
    githubUrl: 'https://github.com/walkinguy1',
    liveUrl: null,
    imgKey: 'projImg1',
  },
  {
    slug: 'pygame-library',
    title: 'PyGame Mini-Game Library',
    description: 'A collection of classic mini-games — Snake, Pong, Breakout — built from scratch using Python\'s Pygame library with custom game logic.',
    tech: ['Python', 'Pygame', 'OOP'],
    githubUrl: 'https://github.com/walkinguy1',
    liveUrl: null,
    imgKey: 'projImg2',
  },
  {
    slug: 'food-ordering',
    title: 'Food Ordering Website',
    description: 'Full-stack food ordering platform with user authentication, cart management, and order tracking — powered by React on the frontend and FastAPI on the backend.',
    tech: ['React', 'FastAPI', 'Python', 'SQL'],
    githubUrl: 'https://github.com/walkinguy1',
    liveUrl: null,
    imgKey: 'projImg3',
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

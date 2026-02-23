const ITEMS = [
  'Web Development', '✦', 'Machine Learning', '✦', 'FastAPI', '✦',
  'React', '✦', 'Python', '✦', 'UI/UX Design', '✦', 'Problem Solving',
  '✦', 'Open Source', '✦', 'SQL', '✦', 'Pygame', '✦'
];

export const Marquee = ({ reverse = false, light = false }) => {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div
      className={`marquee-strip ${reverse ? 'marquee-strip--reverse' : ''} ${light ? 'marquee-strip--light' : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className="marquee-track">
        {repeated.map((item, i) => (
          <span key={i} className="marquee-item">{item}</span>
        ))}
      </div>
    </div>
  );
};

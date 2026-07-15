import styles from './Marquee.module.css';

const ITEMS = [
  'Web Development', '✦', 'Machine Learning', '✦', 'FastAPI', '✦',
  'React', '✦', 'Python', '✦', 'UI/UX Design', '✦', 'Problem Solving',
  '✦', 'Open Source', '✦', 'SQL', '✦', 'Pygame', '✦'
];

export const Marquee = ({ reverse = false, light = false }) => {
  const repeated = [...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div
      className={`${styles.marqueeStrip} ${reverse ? styles.marqueeStripReverse : ''} ${light ? styles.marqueeStripLight : ''}`}
      aria-hidden="true"
      role="presentation"
    >
      <div className={styles.marqueeTrack}>
        {repeated.map((item, i) => (
          <span key={i} className={styles.marqueeItem}>{item}</span>
        ))}
      </div>
    </div>
  );
};

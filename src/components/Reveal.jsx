import useInView from '../hooks/useInView';

/**
 * Wraps a block so it animates in the first time it scrolls into view.
 * `animation` is a global class from styles/animations.css.
 */
export const Reveal = ({ className = '', animation = 'reveal-fade', children }) => {
  const [ref, inView] = useInView();

  return (
    <div ref={ref} className={`${className} ${inView ? animation : ''}`.trim()}>
      {children}
    </div>
  );
};

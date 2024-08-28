import { useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../styles/FloatingIcons.module.css';

const FloatingIcons = ({ icons }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const iconElements = container.children;

    const animateIcon = (icon) => {
      const speed = 0.5 + Math.random() * 0.5; // pixels per second
      const angle = Math.random() * 2 * Math.PI; // random direction
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      // Set initial random position
      let x = Math.random() * (container.offsetWidth - icon.offsetWidth);
      let y = Math.random() * (container.offsetHeight - icon.offsetHeight);
      icon.style.transform = `translate(${x}px, ${y}px)`;

      const move = () => {
        x += vx;
        y += vy;

        // Bounce off the edges
        if (x <= 0 || x + icon.offsetWidth >= container.offsetWidth) {
          x = Math.max(0, Math.min(x, container.offsetWidth - icon.offsetWidth));
          vx *= -1;
        }
        if (y <= 0 || y + icon.offsetHeight >= container.offsetHeight) {
          y = Math.max(0, Math.min(y, container.offsetHeight - icon.offsetHeight));
          vy *= -1;
        }

        icon.style.transform = `translate(${x}px, ${y}px)`;
        requestAnimationFrame(move);
      };

      move();
    };

    Array.from(iconElements).forEach(animateIcon);
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      {icons.map((icon, index) => (
        <div key={`${icon.name}-${index}`} className={styles.icon}>
          <Image src={icon.icon} alt={icon.name} width={64} height={64} />
        </div>
      ))}
    </div>
  );
};

export default FloatingIcons;
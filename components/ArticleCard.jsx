import Image from 'next/image';
import styles from '../styles/ArticleCard.module.css';

const ArticleCard = ({ article }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Image 
          src={article.image} 
          alt={article.title} 
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{article.title}</h3>
        <p>{article.description}</p>
        <div className={styles.cta}>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.underline}
          >
            Read Article
          </a>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
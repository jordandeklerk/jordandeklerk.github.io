import Image from 'next/image';
import styles from '../styles/ProjectCard.module.css';

const ProjectCard = ({ project }) => {
  const getTagContent = (tag) => {
    const iconMap = {
      python: '/python.svg',
      xarray: '/xarray.svg',
      scipy: '/scipy.svg',
      pandas: '/pandas.svg',
      pytorch: '/pytorch.svg',
      numpy: '/numpy.svg',
      git: '/git.svg',
      wandb: '/wandb.svg',
      huggingface: '/huggingface.svg',
      react: '/reactjs.svg',
      javascript: '/javascript.svg',
      html: '/html5.svg',
      css: '/css3.svg',
      typescript: '/type.png',
    };

    if (iconMap[tag.toLowerCase()]) {
      return (
        <Image
          src={iconMap[tag.toLowerCase()]}
          alt={tag}
          width={35}
          height={35}
        />
      );
    }
    return tag;
  };

  return (
    <div className={styles.card}>
      <Image src={project.image} height={300} width={600} alt={project.name} />
      <div className={styles.content}>
        <h3 className={styles.title}>{project.name}</h3>
        <p>{project.description}</p>
        <div className={styles.tags}>
          {project.tags.map((tag) => (
            <span key={tag} className={`${styles.tag} ${tag.toLowerCase()}`}>
              {getTagContent(tag)}
            </span>
          ))}
        </div>
        <div className={styles.cta}>
          {project.source_code && (
            <a
              href={project.source_code}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.underline}
            >
              Source Code
            </a>
          )}
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.underline}
            >
              Tutorial
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
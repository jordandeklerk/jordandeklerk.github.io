import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/AboutPage.module.css';

const AboutPage = () => {
  const [imageSize, setImageSize] = useState({ width: 200, height: 200 });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth < 768 ? 150 : 200;
      setImageSize({ width, height: width });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const techStack = [
    { name: 'Python', icon: '/python.svg' },
    { name: 'R', icon: '/r.png' },
    { name: 'Pytorch', icon: '/pytorch.svg' },
    { name: 'TensorFlow', icon: '/tensorflow.svg' },
    { name: 'Scikit-learn', icon: '/scikit.svg' },
    { name: 'Numpy', icon: '/numpy.svg' },
    { name: 'SciPy', icon: '/scipy.svg' },
    { name: 'Xarray', icon: '/xarray.svg' },
    { name: 'Pandas', icon: '/pandas.svg' },
    { name: 'Hugging Face', icon: '/hugging.svg' },
    { name: 'GCP', icon: '/gcp.svg' },
    { name: 'Azure', icon: '/microsoftazure.svg' },
    { name: 'Kubernetes', icon: '/kubernetes.svg' },
    { name: 'Docker', icon: '/docker2.svg' },
    { name: 'Spark', icon: '/spark.svg' },
    { name: 'Git', icon: '/git.png' },
    { name: 'SQL', icon: '/sql.svg' },
  ];

  const education = [
    { degree: 'Master of Science, Statistics', university: 'University of Illinois Urbana-Champaign', icon: '/uiuc.png' },
    { degree: 'Master of Science, Economics', university: 'University of Wisconsin-Madison', icon: '/wisconsin.png' },
    { degree: 'Bachelor of Arts, Economics and Mathematics', university: 'University of Central Florida', icon: '/ucf.png' },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About Me</h1>
      
      <section className={styles.introduction}>
        <div className={styles.introContent}>
          <div className={styles.photoContainer}>
            <Image 
              src="/jordan-photo.jpg" 
              alt="Jordan Deklerk" 
              width={imageSize.width} 
              height={imageSize.height}
              className={styles.photo}
            />
          </div>
          <div className={styles.introText}>
            <h2></h2>
            <p className={styles.introParagraph}>
              I'm a Senior Data Scientist at DICK's Sporting Goods on the media science team working on causal inference for marketing and hierarchical Bayesian media mix modeling.
            </p>
            <p className={styles.introParagraph}>
            I enjoy creating and contributing to open source software. Currently, I am a member of the core development team for ArviZ, a modular and flexible Python library for exploratory analysis of Bayesian models, where I work on statistical computation and algorithmic design.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.education}>
        <h2>Education</h2>
        <ul>
          {education.map((edu, index) => (
            <li key={index} className={styles.educationItem}>
              <div className={styles.educationIcon}>
                <Image src={edu.icon} alt={edu.university} width={64} height={64} objectFit="cover" />
              </div>
              <div className={styles.educationDetails}>
                <p className={styles.educationDegree}>{edu.degree}</p>
                <p className={styles.educationUniversity}>{edu.university}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.techStack}>
        <h2>Technology Stack</h2>
        <div className={styles.techIcons}>
          {techStack.map((tech) => (
            <div key={tech.name} className={styles.techItem}>
              <Image src={tech.icon} alt={tech.name} width={55} height={55} />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'About' },
  };
}

export default AboutPage;
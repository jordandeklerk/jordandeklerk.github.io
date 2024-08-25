import Tab from './Tab';
import styles from '../styles/Tabsbar.module.css';

const Tabsbar = () => {
  return (
    <div className={styles.tabs}>
      <Tab icon="/react_icon.svg" filename="home.jsx" path="/" />
      <Tab icon="/html_icon.svg" filename="about.html" path="/about" />
      <Tab icon="/git.png" filename="resume.html" path="/resume" />
      <Tab icon="/yaml.svg" filename="contact.css" path="/contact" />
      <Tab icon="/python.svg" filename="projects.js" path="/projects" />
      <Tab icon="/json_icon.svg" filename="articles.json" path="/articles" />
    </div>
  );
};

export default Tabsbar;
import Tab from './Tab';
import styles from '../styles/Tabsbar.module.css';

const Tabsbar = () => {
  return (
    <div className={styles.tabs}>
      <Tab icon="/react_icon.svg" filename="home" path="/" />
      <Tab icon="/html_icon.svg" filename="about" path="/about" />
      <Tab icon="/yaml.svg" filename="contact" path="/contact" />
      <Tab icon="/python.svg" filename="projects" path="/projects" />
      <Tab icon="/github.svg" filename="github" path="/github" />
    </div>
  );
};

export default Tabsbar;
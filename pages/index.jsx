import Link from 'next/link';
import FloatingIcons from '../components/FloatingIcons';
import styles from '../styles/HomePage.module.css';

export default function HomePage() {
  const techStack = [
    { name: 'Python', icon: '/python.svg' },
    { name: 'R', icon: '/r.png' },
    { name: 'Pytorch', icon: '/pytorch.svg' },
    { name: 'Scikit-learn', icon: '/scikit.svg' },
    { name: 'TensorFlow', icon: '/tensorflow.svg' },
    { name: 'Hugging Face', icon: '/hugging.svg' },
    { name: 'Javascript', icon: '/javascript.svg' },
    { name: 'React', icon: '/reactjs.svg' },
    { name: 'Node.js', icon: '/nodejs.svg' },
    { name: 'HTML', icon: '/html5.svg' },
    { name: 'NPM', icon: '/npm.svg' },
    { name: 'GCP', icon: '/gcp.svg' },
    { name: 'AWS', icon: '/aws.svg' },
    { name: 'Kubernetes', icon: '/kubernetes.svg' },
    { name: 'Docker', icon: '/docker2.svg' },
    { name: 'Spark', icon: '/spark.svg' },
    { name: 'SQL', icon: '/sql.svg' },
    { name: 'Linux', icon: '/linux.png' },
  ];

  const additionalIcons = [
    { name: 'Ruby', icon: '/ruby.svg' },
    { name: 'Atlassian', icon: '/atlassian.svg' },
    { name: 'C', icon: '/c.svg' },
    { name: 'C#', icon: '/csharp.svg' },
    { name: 'Cloudflare', icon: '/cloudflare.svg' },
    { name: 'Gitlab', icon: '/gitlab.svg' },
    { name: 'AtlassianJira', icon: '/atlassianjira.svg' },
    { name: 'CSS3', icon: '/css3.svg' },
    { name: 'discord', icon: '/discord.svg' },
    { name: 'DuckDuckGo', icon: '/duckduckgo.svg' },
    { name: 'Github', icon: '/github.svg' },
    { name: 'Homebrew', icon: '/homebrew.svg' },
    { name: 'Jupyter', icon: '/jupyter.svg' },
    { name: 'Jekyll', icon: '/jekyll.svg' },
    { name: 'MySQL', icon: '/mysql.svg' },
    { name: 'Vim', icon: '/vim.svg' },
    { name: 'Yaml', icon: '/yaml.svg' },
    { name: 'Yarn', icon: '/yarn.svg' },
    { name: 'Vercel', icon: '/vercel.svg' },
    { name: 'VSCode', icon: '/vscode_icon.svg' },
    { name: 'JAX', icon: '/jax2.png' },
    { name: 'Numpy', icon: '/numpy.svg' },
    { name: 'Linux', icon: '/linux.png' },
    { name: 'Git', icon: '/git.png' },
    { name: 'Typescript', icon: '/type.png' },
  ];

  const allIcons = [...techStack, ...additionalIcons];

  return (
    <>
      <div className={styles.container}>
        <FloatingIcons icons={allIcons} />
        <div className={styles.foreground}>
          <div className={styles.content}>
            <h1 className={styles.name}>Jordan Deklerk</h1>
            <h6 className={styles.bio}>Senior Data Scientist</h6>
            <div className={styles.buttonContainer}>
              <Link href="/resume">
                <button className={styles.button}>Resume</button>
              </Link>
              <Link href="/contact">
                <button className={styles.button}>Contact</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  return {
    props: { title: 'Home' },
  };
}
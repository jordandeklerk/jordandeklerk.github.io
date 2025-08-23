import GitHubCalendar from 'react-github-calendar';
import styles from '../styles/GithubPage.module.css';

const GithubPage = () => {

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>GitHub Activity</h1>
      
      <section className={styles.calendarSection}>
        <h2>Contribution Graph</h2>
        <div className={styles.calendarWrapper}>
          <GitHubCalendar 
            username="jordandeklerk"
            blockSize={15}
            blockMargin={5}
            fontSize={16}
            colorScheme="dark"
          />
        </div>
      </section>

      <section className={styles.stats}>
        <h2>GitHub Stats</h2>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <img 
              src="https://github-readme-stats.vercel.app/api?username=jordandeklerk&show_icons=true&theme=dark&hide_border=true"
              alt="GitHub Stats"
            />
          </div>
          <div className={styles.statCard}>
            <img 
              src="https://github-readme-stats.vercel.app/api/top-langs/?username=jordandeklerk&layout=compact&theme=dark&hide_border=true"
              alt="Top Languages"
            />
          </div>
        </div>
      </section>

      <section className={styles.streakSection}>
        <h2>Contribution Streak</h2>
        <div className={styles.streakWrapper}>
          <img 
            src="https://github-readme-streak-stats.herokuapp.com/?user=jordandeklerk&theme=dark&hide_border=true"
            alt="GitHub Streak"
          />
        </div>
      </section>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'GitHub Activity' },
  };
}

export default GithubPage;
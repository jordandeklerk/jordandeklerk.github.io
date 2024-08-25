import styles from '../styles/ResumePage.module.css';

const ResumePage = () => {
  const googleDriveEmbedUrl = 'https://drive.google.com/file/d/1R7JUDjQbMZQ9ykwFF6QANORwPxpwBQug/preview';
  const googleDriveDownloadUrl = 'https://drive.google.com/uc?export=download&id=1R7JUDjQbMZQ9ykwFF6QANORwPxpwBQug';

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Resume (<a href={googleDriveDownloadUrl} className={styles.underline} target="_blank" rel="noopener noreferrer">Download</a>)
      </h3>
      <div className={styles.pdfContainer}>
        <iframe 
          src={googleDriveEmbedUrl}
          className={styles.pdfViewer}
          title="Resume"
          frameBorder="0"
        />
      </div>
    </div>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Resume' },
  };
}

export default ResumePage;
import ArticleCard from '../components/ArticleCard';
import styles from '../styles/ArticlesPage.module.css';

const articles = [
  {
    id: 1,
    title: "An Introduction to Reinforcement Learning",
    description: "This post introduces the fundamentals of reinforcement learning from a theoretical perspective, covering key concepts like Markov Decision Processes, policies, and value functions. We also explain dynamic programming techniques for solving RL problems.",
    url: "https://ml-tutorials.netlify.app/blog/rl-intro/",
    image: "/blog-images/rl2.png"
  },
  {
    id: 2,
    title: "Masked Token Learning for Inpatient Diagnosis and Procedure Prediction",
    description: "This post discusses a BERT-style transformer model adapted for predicting diagnoses and procedure codes from synthetic Electronic Health Records (EHR). We walkthrough the code step by step and provide intuition for the model and downstream applications.",
    url: "https://ml-tutorials.netlify.app/blog/ehr-bert/",
    image: "/blog-images/bert.jpg"
  },
  {
    id: 3,
    title: "Closing the Amortization Gap in Bayesian Deep Generative Models",
    description: "This post examines amortized variational inference (A-VI) in Bayesian deep generative models, focusing on reducing the amortization gap in VAEs. We compare A-VI with traditional methods, showing its computational efficiency and competitive performance on benchmark datasets.",
    url: "https://ml-tutorials.netlify.app/blog/amortized-bayes/",
    image: "/blog-images/vae.png"
  },
  {
    id: 4,
    title: "Fine-Tuning a Coding LLM for SQL Code Generation",
    description: "This post implements fine-tuning a coding LLM for SQL code generation using QLoRA+. We cover techniques like quantization and noisy embeddings to enhance performance on a single GPU, making it suitable for resource-constrained environments.",
    url: "https://ml-tutorials.netlify.app/blog/open-code/",
    image: "/blog-images/llm.png"
  },
];

const ArticlesPage = () => {
  return (
    <>
      <h3>
        Recent Posts from{' '}
        <a
          href="https://ml-tutorials.netlify.app"
          target="_blank"
          rel="noopener"
          className={styles.underline}
        >
          ML Tutorials
        </a>
      </h3>
      <div className={styles.container}>
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </>
  );
};

export async function getStaticProps() {
  return {
    props: { title: 'Articles' },
  };
}

export default ArticlesPage;
import ArticleCard from '../components/ArticleCard';
import styles from '../styles/ArticlesPage.module.css';

const articles = [
  {
    id: 1,
    title: "An Introduction to Reinforcement Learning",
    description: "This article provides a comprehensive introduction to the fundamentals of reinforcement learning (RL), focusing on classical theoretical perspectives. It delves into key concepts such as Markov Decision Processes, policies, value functions, and the Bellman equations, which are essential for understanding how RL algorithms help agents learn optimal behaviors through interactions with their environment. The post also discusses various RL settings, including finite and infinite horizons, and introduces dynamic programming techniques like policy and value iteration for solving RL problems. Overall, it serves as a foundational guide for anyone interested in exploring the theoretical underpinnings of RL and its applications in complex decision-making systems.",
    url: "https://ml-tutorials.netlify.app/blog/rl-intro/",
    image: "/blog-images/rl2.png"
  },
  {
    id: 2,
    title: "Masked Token Learning for Inpatient Diagnosis and Procedure Prediction",
    description: "This article delves into the development and application of a BERT-style transformer model specifically designed for predicting diagnoses and procedures from Electronic Health Records (EHR). It outlines the process of adapting the BERT architecture to meet the unique demands of structured EHR data, leveraging pre-training techniques and a masked language model to enhance the model's predictive accuracy. The training process, spanning 15 epochs, demonstrates promising results with high PR-AUC scores for both diagnosis and procedure predictions.",
    url: "https://ml-tutorials.netlify.app/blog/ehr-bert/",
    image: "/blog-images/bert.jpg"
  },
  {
    id: 3,
    title: "Closing the Amortization Gap in Bayesian Deep Generative Models",
    description: "This article delves into the application of amortized variational inference (A-VI) within Bayesian deep generative models, specifically focusing on closing the amortization gap in variational autoencoders (VAEs). It provides a detailed exploration of the theoretical underpinnings and practical implementations of A-VI, comparing its performance with traditional variational inference methods through extensive numerical experiments on benchmark datasets like MNIST and FashionMNIST. The findings demonstrate that A-VI, when implemented with deep neural networks, matches the performance of traditional methods in terms of the evidence lower bound (ELBO) and reconstruction mean squared error (MSE), while offering significant computational speed advantages.",
    url: "https://ml-tutorials.netlify.app/blog/amortized-bayes/",
    image: "/blog-images/vae.png"
  },
  {
    id: 4,
    title: "Fine-Tuning a Coding LLM for SQL Code Generation",
    description: "This article explores the fine-tuning of a large language model (LLM) for SQL code generation, specifically using the QLoRA+ method to enhance text-to-SQL tasks. It details the process of adapting the model to generate SQL queries from natural language inputs, leveraging a specialized dataset designed to minimize errors common in text-to-SQL translation. The tutorial demonstrates the application of advanced techniques like quantization, LoRA+, and NEFTune noisy embeddings to optimize the fine-tuning process on a single GPU, making it feasible for resource-constrained environments.",
    url: "https://ml-tutorials.netlify.app/blog/open-code/",
    image: "/blog-images/llm.png"
  },
  // Add more articles as needed
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
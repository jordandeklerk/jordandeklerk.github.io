import Head from 'next/head';

const CustomHead = ({ title }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta
        name="description"
        content="Jordan Deklerk is a senior data scientist at DICK's Sporting Goods building machine learning models to improve the customer experience"
      />
      <meta
        name="keywords"
        content="jordan deklerk, jordan, deklerk, data scientist portfolio, jordan deklerk portfolio, dicks sporting goods, dicks, sporting goods, machine learning, data science"
      />
      <meta property="og:title" content="Jordan Deklerk's Portfolio" />
      <meta
        property="og:description"
        content="A senior data scientist at DICK's Sporting Goods building machine learning models to improve the customer experience"
      />
      <meta property="og:url" content="https://jordandeklerk.com" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  );
};

export default CustomHead;

CustomHead.defaultProps = {
  title: 'Jordan Deklerk',
};

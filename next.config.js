module.exports = {
  images: {
    domains: [
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'imgur.com',
      'ml-tutorials.netlify.app',
    ],
  },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/Resume.pdf',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; object-src 'self'",
          },
        ],
      },
    ];
  },
};
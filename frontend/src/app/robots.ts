import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/admin/', 
        '/faculty/', 
        '/hod/', 
        '/student/'
      ],
    },
    sitemap: 'https://campus-learn-two.vercel.app/sitemap.xml',
  };
}

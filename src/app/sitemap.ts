import { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://PatrykKul.github.io/korepetycje', 
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://PatrykKul.github.io/korepetycje/#services',
      lastModified: new Date(),
      changeFrequency: 'monthly', 
      priority: 0.8,
    },
    {
      url: 'https://PatrykKul.github.io/korepetycje/#portfolio',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://PatrykKul.github.io/korepetycje/#testimonials',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://PatrykKul.github.io/korepetycje/#contact',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    }
  ]
}
import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://guipordi.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
  ]
}
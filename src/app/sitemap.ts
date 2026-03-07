import { MetadataRoute } from 'next'
import articlesData from '../data/articles.json'
import vehiclesData from '../data/vehicles.json'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://bahan-bakar-id.vercel.app'
    const lastModified = new Date()

    return [
        {
            url: `${baseUrl}`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/privacy-policy`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/terms-of-service`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/disclaimer`,
            lastModified,
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified,
            changeFrequency: 'yearly',
            priority: 0.7,
        },
        {
            url: `${baseUrl}/kendaraan`,
            lastModified,
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        ...articlesData.map((article) => ({
            url: `${baseUrl}/blog/${article.slug}`,
            lastModified: new Date(article.date),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        })),
        ...vehiclesData.map((vehicle) => ({
            url: `${baseUrl}/kendaraan/${vehicle.id}`,
            lastModified,
            changeFrequency: 'yearly' as const,
            priority: 0.8,
        })),
    ]
}

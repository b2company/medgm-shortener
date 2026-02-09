import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
})

export async function saveShortUrl(slug: string, url: string): Promise<void> {
  await redis.set(slug, url)
}

export async function getOriginalUrl(slug: string): Promise<string | null> {
  return await redis.get<string>(slug)
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

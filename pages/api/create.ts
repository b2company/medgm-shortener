import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import { saveShortUrl, isValidUrl } from '@/lib/kv'

type ResponseData = {
  shortUrl?: string
  slug?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' })
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  try {
    // Gerar slug único de 6 caracteres
    const slug = nanoid(6)

    // Salvar no KV
    await saveShortUrl(slug, url)

    return res.status(200).json({
      shortUrl: `medgm.com.br/${slug}`,
      slug
    })
  } catch (error) {
    console.error('Error creating short URL:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

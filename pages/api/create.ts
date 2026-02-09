import type { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import { saveShortUrl, isValidUrl, getOriginalUrl } from '@/lib/kv'

type ResponseData = {
  shortUrl?: string
  slug?: string
  customSlug?: boolean
  error?: string
  details?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { url, customSlug } = req.body

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'URL is required' })
  }

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' })
  }

  try {
    let slug: string
    let isCustomSlug = false

    if (customSlug) {
      // Validar formato do slug customizado
      if (typeof customSlug !== 'string' || !/^[a-zA-Z0-9_-]{2,50}$/.test(customSlug)) {
        return res.status(400).json({
          error: 'Slug deve ter 2-50 caracteres (letras, números, - ou _)'
        })
      }

      // Verificar se slug já existe
      try {
        const existing = await getOriginalUrl(customSlug)
        if (existing) {
          return res.status(409).json({
            error: `O slug '${customSlug}' já está em uso`
          })
        }
      } catch (kvError) {
        console.error('Error checking existing slug:', kvError)
        // Se falhar ao verificar, continua (permite criar slug customizado)
      }

      slug = customSlug
      isCustomSlug = true
    } else {
      // Gerar slug único de 6 caracteres
      slug = nanoid(6)
    }

    // Salvar no KV
    await saveShortUrl(slug, url)

    return res.status(200).json({
      shortUrl: `medgm.com.br/${slug}`,
      slug,
      customSlug: isCustomSlug
    })
  } catch (error) {
    console.error('Error creating short URL:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({
      error: 'Erro ao salvar link. Verifique as configurações do banco de dados.',
      details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    })
  }
}

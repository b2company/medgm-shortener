import { useState, useEffect } from 'react'
import Head from 'next/head'

interface LinkHistoryItem {
  slug: string
  url: string
  shortUrl: string
  createdAt: string
  customSlug: boolean
}

export default function Home() {
  const [url, setUrl] = useState('')
  const [customSlug, setCustomSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{shortUrl: string, slug: string} | null>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Histórico
  const [history, setHistory] = useState<LinkHistoryItem[]>([])
  const [editingItem, setEditingItem] = useState<LinkHistoryItem | null>(null)
  const [editUrl, setEditUrl] = useState('')

  // Carregar histórico ao montar
  useEffect(() => {
    const stored = localStorage.getItem('medgm-links-history')
    if (stored) {
      try {
        setHistory(JSON.parse(stored))
      } catch (e) {
        console.error('Erro ao carregar histórico:', e)
      }
    }
  }, [])

  // Função criar link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, customSlug: customSlug || undefined })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erro ao criar link')
        return
      }

      setResult(data)

      // Salvar no histórico
      const historyItem: LinkHistoryItem = {
        slug: data.slug,
        url: url,
        shortUrl: data.shortUrl,
        createdAt: new Date().toISOString(),
        customSlug: data.customSlug || false
      }

      const newHistory = [historyItem, ...history]
      localStorage.setItem('medgm-links-history', JSON.stringify(newHistory))
      setHistory(newHistory)

      // Limpar formulário
      setUrl('')
      setCustomSlug('')

    } catch (err) {
      setError('Erro ao conectar com servidor')
    } finally {
      setLoading(false)
    }
  }

  // Copiar link
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Deletar do histórico
  const handleDelete = (slug: string) => {
    const updated = history.filter(item => item.slug !== slug)
    localStorage.setItem('medgm-links-history', JSON.stringify(updated))
    setHistory(updated)
  }

  // Abrir modal de edição
  const handleEdit = (item: LinkHistoryItem) => {
    setEditingItem(item)
    setEditUrl(item.url)
  }

  // Salvar edição (cria novo link com mesmo slug)
  const handleSaveEdit = async () => {
    if (!editingItem) return

    setLoading(true)
    try {
      const res = await fetch('/api/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: editUrl,
          customSlug: editingItem.slug
        })
      })

      if (res.ok) {
        // Atualizar histórico
        const updated = history.map(item =>
          item.slug === editingItem.slug
            ? { ...item, url: editUrl, createdAt: new Date().toISOString() }
            : item
        )
        localStorage.setItem('medgm-links-history', JSON.stringify(updated))
        setHistory(updated)
        setEditingItem(null)
      } else {
        const data = await res.json()
        alert(data.error || 'Erro ao atualizar link')
      }
    } catch {
      alert('Erro ao conectar com servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>links.medgm.com.br - Encurtador de Links</title>
        <meta name="description" content="Encurtador de links links.medgm.com.br" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
        <div className="max-w-2xl mx-auto">

          {/* Formulário principal */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-t-4 border-[#D4AF37]">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              links.<span className="text-[#D4AF37]">medgm</span>.com.br
            </h1>
            <p className="text-gray-600 mb-6">Encurtador de Links Profissional</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cole sua URL longa aqui
                </label>
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
                  placeholder="https://exemplo.com/url-muito-longa"
                  required
                />
              </div>

              {/* Campo Slug Customizado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug customizado (opcional)
                </label>
                <input
                  type="text"
                  value={customSlug}
                  onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
                  placeholder="bio, instagram, etc"
                  pattern="[a-zA-Z0-9_-]{2,50}"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ⓘ Deixe em branco para gerar automaticamente
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#D4AF37] text-gray-900 py-3 rounded-lg font-bold uppercase tracking-wide hover:bg-[#c49d2e] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
              >
                {loading ? 'Encurtando...' : 'Encurtar Link'}
              </button>
            </form>

            {/* Resultado de erro */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Resultado de sucesso */}
            {result && (
              <div className="mt-4 p-4 bg-gradient-to-r from-[#D4AF37]/10 to-[#D4AF37]/5 border-2 border-[#D4AF37] rounded-lg">
                <p className="text-sm text-gray-600 mb-2 font-medium">✓ Link criado com sucesso:</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-[#D4AF37]">
                    {result.shortUrl}
                  </p>
                  <button
                    onClick={() => copyToClipboard(`https://${result.shortUrl}`)}
                    className="px-4 py-1.5 bg-[#D4AF37] text-gray-900 rounded font-bold text-sm hover:bg-[#c49d2e] transition-all hover:scale-105"
                  >
                    {copied ? '✓ Copiado' : 'Copiar'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Histórico */}
          {history.length > 0 && (
            <div className="bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-[#D4AF37]">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#D4AF37]">📋</span> Histórico de Links
              </h2>

              <div className="space-y-3">
                {history.map((item) => (
                  <div
                    key={item.slug}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#D4AF37] hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-lg font-bold text-[#D4AF37]">
                            {item.shortUrl}
                          </p>
                          {item.customSlug && (
                            <span className="px-2 py-0.5 text-xs bg-[#D4AF37] text-gray-900 rounded-full font-bold">
                              CUSTOM
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1" title={item.url}>
                          → {item.url}
                        </p>
                        <p className="text-xs text-gray-400">
                          📅 {new Date(item.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => copyToClipboard(`https://${item.shortUrl}`)}
                        className="text-sm font-medium text-gray-600 hover:text-[#D4AF37] transition-all hover:scale-110"
                      >
                        📋 Copiar
                      </button>
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-sm font-medium text-gray-600 hover:text-[#D4AF37] transition-all hover:scale-110"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDelete(item.slug)}
                        className="text-sm font-medium text-gray-600 hover:text-red-600 transition-all hover:scale-110"
                      >
                        🗑️ Deletar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal de Edição */}
          {editingItem && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full border-t-4 border-[#D4AF37]">
                <h3 className="text-xl font-bold mb-4 text-gray-900">
                  Editar Link: <span className="text-[#D4AF37]">{editingItem.slug}</span>
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nova URL de destino
                  </label>
                  <input
                    type="text"
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all"
                    placeholder="https://nova-url.com"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    O link {editingItem.shortUrl} passará a redirecionar para esta URL
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    disabled={loading}
                    className="flex-1 bg-[#D4AF37] text-gray-900 py-2.5 rounded-lg font-bold hover:bg-[#c49d2e] disabled:opacity-50 transition-all hover:scale-105"
                  >
                    {loading ? 'Salvando...' : 'Salvar'}
                  </button>
                  <button
                    onClick={() => setEditingItem(null)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}

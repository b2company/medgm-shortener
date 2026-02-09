# medgm.com.br - Encurtador de Links

Encurtador de links simples e rápido usando Next.js e Vercel KV.

## Stack

- **Framework**: Next.js 14
- **Hospedagem**: Vercel
- **Database**: Vercel KV (Redis)
- **Linguagem**: TypeScript
- **Estilo**: Tailwind CSS

## Estrutura do Projeto

```
medgm-shortener/
├── pages/
│   ├── index.tsx          # Interface web para criar links
│   ├── [slug].tsx         # Redirecionamento dinâmico
│   ├── 404.tsx           # Página de erro
│   └── api/
│       └── create.ts      # API para criar links curtos
├── lib/
│   └── kv.ts             # Client do Vercel KV
├── styles/
│   └── globals.css       # Estilos globais + Tailwind
└── public/               # Arquivos estáticos
```

## Instalação

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
```bash
cp .env.local.example .env.local
```

3. Adicionar as credenciais do Vercel KV no `.env.local`:
```
KV_REST_API_URL=your_kv_rest_api_url
KV_REST_API_TOKEN=your_kv_rest_api_token
KV_URL=your_kv_url
```

## Desenvolvimento

Executar servidor de desenvolvimento:
```bash
npm run dev
```

Acessar em: `http://localhost:3000`

## Deploy na Vercel

1. Criar projeto no Vercel:
```bash
vercel
```

2. Adicionar Vercel KV:
   - Ir no dashboard do projeto
   - Storage → Create Database → KV
   - As variáveis de ambiente serão configuradas automaticamente

3. Configurar domínio:
   - Settings → Domains
   - Adicionar `medgm.com.br`
   - Configurar DNS conforme instruções

4. Deploy em produção:
```bash
vercel --prod
```

## Uso

### Interface Web

1. Acessar `medgm.com.br`
2. Colar URL longa no campo
3. Clicar em "Encurtar Link"
4. Copiar link curto gerado

### API

**Criar link curto:**
```bash
curl -X POST https://medgm.com.br/api/create \
  -H "Content-Type: application/json" \
  -d '{"url":"https://exemplo.com/url-longa"}'
```

**Response:**
```json
{
  "shortUrl": "medgm.com.br/abc123",
  "slug": "abc123"
}
```

**Usar link curto:**
```
https://medgm.com.br/abc123
→ Redireciona para URL original
```

## Funcionalidades

- ✅ Geração automática de slug (6 caracteres)
- ✅ Validação de URLs
- ✅ Redirecionamento 302
- ✅ Página 404 customizada
- ✅ Interface responsiva
- ✅ Botão copiar link
- ✅ Feedback visual (loading, success, error)

## Limitações Gratuitas (Vercel)

- **Bandwidth**: 100GB/mês
- **KV Storage**: 256MB
- **KV Comandos**: 100K/mês

Para uso do medgm.com.br, esses limites são mais que suficientes.

## Custo

**R$ 0,00/mês** (dentro dos limites gratuitos da Vercel)

## Próximos Passos (Opcional)

- [ ] Autenticação para criar links
- [ ] Contador de cliques
- [ ] Expiração de links
- [ ] Custom slugs
- [ ] Painel admin
- [ ] Analytics básico

## Suporte

Desenvolvido para **medgm.com.br** - B2 Company

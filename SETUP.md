# Setup do Encurtador medgm.com.br

## 1. Instalação Completa ✅

O projeto já está instalado e pronto para usar.

## 2. Próximos Passos

### Opção A: Deploy Imediato na Vercel (Recomendado)

1. **Instalar Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login na Vercel:**
```bash
vercel login
```

3. **Deploy do projeto:**
```bash
cd ~/code/medgm-shortener
vercel
```

4. **Adicionar Vercel KV (Storage):**
   - Acessar: https://vercel.com/dashboard
   - Selecionar o projeto `medgm-shortener`
   - Ir em "Storage" → "Create Database"
   - Selecionar "KV" (Upstash Redis)
   - Nome: `medgm-kv` ou qualquer nome
   - Região: `us-east-1` (ou a mais próxima)
   - Clicar em "Create"

   As variáveis de ambiente serão automaticamente configuradas no projeto.

5. **Configurar domínio medgm.com.br:**
   - No dashboard do projeto Vercel
   - Settings → Domains
   - Adicionar: `medgm.com.br`
   - Seguir instruções de DNS:
     - Tipo A: `76.76.21.21`
     - ou CNAME: `cname.vercel-dns.com`

6. **Deploy em produção:**
```bash
vercel --prod
```

7. **Testar:**
   - Acessar: `https://medgm.com.br`
   - Criar um link curto
   - Testar redirecionamento

### Opção B: Desenvolvimento Local Primeiro

Para testar localmente, você precisa de um Redis. Opções:

**Opção B1: Usar Upstash Redis diretamente**
1. Criar conta gratuita: https://console.upstash.com/
2. Criar banco Redis
3. Copiar credenciais REST API
4. Atualizar `.env.local`:
```bash
KV_REST_API_URL=https://your-redis-url.upstash.io
KV_REST_API_TOKEN=your_token_here
```

**Opção B2: Docker Redis local**
```bash
docker run -d -p 6379:6379 redis
```

Depois instalar e configurar um adaptador HTTP para Redis (mais complexo).

**Para desenvolvimento, recomendo ir direto para Opção A (Vercel)**, pois:
- Setup mais rápido
- Vercel KV gratuito
- Ambiente de produção real
- Zero configuração de infraestrutura

## 3. Estrutura Criada

```
~/code/medgm-shortener/
├── pages/
│   ├── index.tsx          # ✅ Interface web
│   ├── [slug].tsx         # ✅ Redirecionamento
│   ├── 404.tsx           # ✅ Página de erro
│   ├── _app.tsx          # ✅ App wrapper
│   └── api/
│       └── create.ts      # ✅ API criar links
├── lib/
│   └── kv.ts             # ✅ Client Redis
├── styles/
│   └── globals.css       # ✅ Tailwind
├── public/               # ✅ Arquivos estáticos
├── package.json          # ✅ Dependências
├── tsconfig.json         # ✅ TypeScript config
├── next.config.js        # ✅ Next.js config
├── tailwind.config.js    # ✅ Tailwind config
├── vercel.json          # ✅ Vercel config
├── .gitignore           # ✅ Git ignore
├── .env.local.example   # ✅ Exemplo de env
├── README.md            # ✅ Documentação
└── SETUP.md             # ✅ Este arquivo
```

## 4. Teste Rápido de Build

Verificar se o projeto compila sem erros:

```bash
cd ~/code/medgm-shortener
npm run build
```

Se compilar sem erros, está tudo OK para deploy!

## 5. Comandos Úteis

```bash
# Desenvolvimento local (requer Redis configurado)
npm run dev

# Build de produção
npm run build

# Iniciar produção local
npm start

# Deploy preview na Vercel
vercel

# Deploy produção na Vercel
vercel --prod

# Ver logs da Vercel
vercel logs
```

## 6. Custos

- **Vercel Hobby Plan**: Gratuito
  - 100GB bandwidth/mês
  - Serverless functions
  - Custom domains

- **Upstash Redis (via Vercel KV)**: Gratuito
  - 256MB storage
  - 100K comandos/mês
  - Sobra para milhares de links

**Total: R$ 0,00/mês**

## 7. Dúvidas?

- Documentação Vercel: https://vercel.com/docs
- Documentação Upstash: https://docs.upstash.com/
- Next.js: https://nextjs.org/docs

---

**Status Atual:** ✅ Projeto pronto para deploy
**Próximo passo:** Deploy na Vercel (Opção A acima)

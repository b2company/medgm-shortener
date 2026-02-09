# Quick Start - Deploy em 5 Minutos

## Pré-requisitos
- Conta na Vercel (gratuita): https://vercel.com/signup

## Deploy Rápido

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Login
```bash
vercel login
```

### 3. Deploy
```bash
cd ~/code/medgm-shortener
vercel
```

Responder aos prompts:
- Set up and deploy? **Yes**
- Which scope? **[seu usuário]**
- Link to existing project? **No**
- Project name? **medgm-shortener** (ou outro nome)
- Directory? **./` (pressionar Enter)
- Override settings? **No**

### 4. Criar Vercel KV

1. Abrir: https://vercel.com/dashboard
2. Clicar no projeto `medgm-shortener`
3. Ir em "Storage" tab
4. Clicar "Create Database"
5. Selecionar "KV"
6. Nome: `medgm-kv`
7. Região: `us-east-1` (ou mais próxima)
8. Clicar "Create"

As variáveis de ambiente serão configuradas automaticamente!

### 5. Redeploy (para pegar as variáveis)
```bash
vercel --prod
```

### 6. Testar

Você receberá uma URL tipo: `https://medgm-shortener.vercel.app`

Testar:
```bash
# Criar link
curl -X POST https://medgm-shortener.vercel.app/api/create \
  -H "Content-Type: application/json" \
  -d '{"url":"https://google.com"}'

# Resposta esperada:
# {"shortUrl":"medgm-shortener.vercel.app/abc123","slug":"abc123"}
```

Acessar no navegador: `https://medgm-shortener.vercel.app/abc123`

Deve redirecionar para Google!

## Configurar Domínio Custom (Opcional)

### 7. Adicionar medgm.com.br

1. No dashboard Vercel → Settings → Domains
2. Adicionar: `medgm.com.br`
3. Configurar DNS (no seu provedor de domínio):

```
Tipo: A
Nome: @
Valor: 76.76.21.21
TTL: 3600
```

OU

```
Tipo: CNAME
Nome: @
Valor: cname.vercel-dns.com
TTL: 3600
```

4. Aguardar propagação DNS (pode levar até 24h, mas geralmente 5-10 min)

5. Testar: `https://medgm.com.br`

## Pronto!

Agora você tem:
- ✅ Encurtador funcionando
- ✅ Interface web
- ✅ API para criar links
- ✅ Redirecionamento automático
- ✅ Custo: R$ 0,00/mês

## Próximos Passos

- Ver logs: `vercel logs`
- Atualizar código: edite e rode `vercel --prod`
- Monitorar uso: https://vercel.com/dashboard → Analytics

## Comandos Úteis

```bash
# Ver logs em tempo real
vercel logs --follow

# Ver lista de deploys
vercel ls

# Ver domínios
vercel domains ls

# Remover projeto (cuidado!)
vercel remove medgm-shortener
```

## Dúvidas?

Consulte:
- `README.md` - Documentação completa
- `SETUP.md` - Setup detalhado
- `CHECKLIST.md` - Checklist completo

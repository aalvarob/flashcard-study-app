# Simulado Concílio - Versão Web

Versão web do aplicativo Simulado Concílio, desenvolvida com React, TypeScript e Vite.

## Funcionalidades

- ✅ Autenticação OAuth
- ✅ Seleção de áreas e cards para estudo
- ✅ Interface de estudo com flashcards
- ✅ Estatísticas e histórico de simulados
- ✅ Responsivo para desktop e mobile

## Estrutura do Projeto

```
web/
  src/
    pages/          ← Páginas principais
    components/     ← Componentes reutilizáveis
    contexts/       ← Context API (autenticação)
    lib/            ← Utilitários e configurações
    App.tsx         ← Componente raiz
    index.css       ← Estilos globais
  public/           ← Arquivos estáticos
  index.html        ← HTML principal
  vite.config.ts    ← Configuração Vite
  tsconfig.json     ← Configuração TypeScript
```

## Desenvolvimento Local

### Pré-requisitos

- Node.js 18+
- npm ou pnpm

### Instalação

```bash
cd web
npm install --legacy-peer-deps
```

### Executar em Desenvolvimento

```bash
npm run dev
```

O app estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `web/dist/`

## Deploy na Hostinger

### Opção 1: Usando cPanel (Recomendado)

1. **Fazer build local**
   ```bash
   npm run build
   ```

2. **Conectar via FTP/SFTP**
   - Use FileZilla ou similar
   - Conecte com as credenciais da Hostinger
   - Navegue até a pasta `public_html` ou `www`

3. **Fazer upload dos arquivos**
   - Limpe a pasta atual (se houver)
   - Faça upload de todos os arquivos de `web/dist/`
   - Certifique-se de que `index.html` está na raiz

4. **Configurar reescrita de URL**
   - Crie um arquivo `.htaccess` na raiz com:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

### Opção 2: Usando Git (Se disponível)

1. **Criar repositório Git**
   ```bash
   cd web
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Fazer push para Hostinger**
   - Siga as instruções do painel da Hostinger
   - Configure o webhook para deploy automático

### Opção 3: Usando Node.js (Se suportado)

1. **Fazer upload do projeto inteiro**
2. **Instalar dependências**
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Fazer build**
   ```bash
   npm run build
   ```
4. **Configurar servidor Node.js**
   - Use PM2 ou similar para manter o servidor rodando

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `web/`:

```env
VITE_API_URL=https://seu-dominio.com/api
VITE_OAUTH_CLIENT_ID=seu_client_id
VITE_OAUTH_REDIRECT_URI=https://seu-dominio.com/oauth/callback
```

## API Backend

A versão web se conecta ao mesmo backend do app mobile. Certifique-se de que:

1. O backend está rodando em `https://seu-dominio.com/api`
2. CORS está configurado para aceitar requisições do frontend
3. Os endpoints OAuth estão configurados corretamente

## Troubleshooting

### "Cannot GET /"

Verifique se o arquivo `.htaccess` está configurado corretamente para reescrever URLs.

### Erro de CORS

Adicione os headers CORS corretos no backend:

```typescript
app.use(cors({
  origin: 'https://seu-dominio.com',
  credentials: true,
}))
```

### Autenticação não funciona

Verifique:
- O `VITE_OAUTH_REDIRECT_URI` está correto
- Os cookies estão sendo enviados (verifique `withCredentials: true`)
- O backend está retornando os headers CORS corretos

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Faz build para produção
- `npm run preview` - Visualiza build local
- `npm run lint` - Executa linter
- `npm run type-check` - Verifica tipos TypeScript

## Suporte

Para dúvidas sobre deploy na Hostinger, consulte:
- [Documentação Hostinger](https://suporte.hostinger.com.br/)
- [Guia de Deploy Vite](https://vitejs.dev/guide/static-deploy.html)

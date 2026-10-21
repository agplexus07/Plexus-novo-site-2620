# Agência Plexus · Site

Landing page da Agência Plexus: posicionamento criativo para marcas e empreendedores ambiciosos.

Site estático (HTML, CSS e JavaScript), sem build e sem dependências para instalar. As animações usam GSAP 3.13 e as fontes vêm do Google Fonts, ambos via CDN.

## Estrutura

```
index.html          página
css/style.css       estilos
css/logos.css       logo e símbolo embutidos (usados como máscara)
js/main.js          animações e interações
assets/img/         fotos e favicons
assets/audio/       música de fundo (não versionada, ver abaixo)
```

## Ver no computador

Dê dois cliques em `Abrir Site Plexus.command` (macOS) ou abra o `index.html` no navegador.

## Publicar na Vercel

1. Envie estes arquivos para um repositório no GitHub.
2. Na Vercel, clique em **Add New → Project**, importe o repositório e clique em **Deploy** (não precisa configurar build: é um site estático).
3. Em **Settings → Domains**, adicione o domínio `agenciaplexus.com.br` e siga as instruções de DNS.

## SEO

O endereço oficial usado no SEO é `https://agenciaplexus.com.br/`. Se o domínio for outro, troque esse endereço em:

- `index.html` (canonical, Open Graph e dados estruturados)
- `robots.txt`
- `sitemap.xml`

Depois de publicar:

1. Cadastre o site no [Google Search Console](https://search.google.com/search-console) e envie `https://agenciaplexus.com.br/sitemap.xml`.
2. Teste os dados estruturados em [Rich Results Test](https://search.google.com/test/rich-results).
3. Coloque o link do site no Perfil da Empresa no Google e na bio do Instagram.

## Publicar no GitHub Pages (alternativa)

1. Crie um repositório no GitHub e envie estes arquivos.
2. No repositório, vá em **Settings → Pages**.
3. Em **Source**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`, e salve.
4. Em alguns minutos o site fica no ar em `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## Música de fundo

O arquivo de música não vai para o GitHub (está no `.gitignore`), porque a faixa atual não tem licença de uso comercial. Sem o arquivo, o site funciona normalmente e o player de volume simplesmente não aparece.

Para usar uma faixa licenciada:

1. Salve o arquivo em `assets/audio/` com o nome `nightshade.mp3`, ou troque o nome no `index.html` (tag `<audio id="bgm">`).
2. Remova a linha `assets/audio/*.mp3` do `.gitignore`.
3. Envie de novo para o GitHub.

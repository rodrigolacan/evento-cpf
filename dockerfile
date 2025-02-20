# 1️⃣ Estágio de Build do Quasar
FROM node:20 AS node_build
WORKDIR /app

COPY . .
RUN npm install
RUN npm run build

# 2️⃣ Estágio para o Proxy (Express)
FROM node:20 AS proxy_build
WORKDIR /proxy

# Copiar apenas os arquivos necessários para o proxy
COPY proxy.js package-proxy.json ./

# Renomear package-proxy.json para package.json
RUN mv package-proxy.json package.json

# Instalar apenas as dependências do proxy
RUN npm install --omit=dev

# 3️⃣ Estágio de Deploy com Nginx + Node.js
FROM nginx:stable-alpine3.20-perl AS nginx_deploy

# Copiar arquivos do build do Quasar para o Nginx
COPY --from=node_build /app/dist/spa /usr/share/nginx/html

# Copiar proxy e dependências
COPY --from=proxy_build /proxy /proxy

# Instalar Node.js no Alpine (para rodar proxy.js)
RUN apk add --no-cache nodejs npm

# Expor portas do Nginx e Node.js (se precisar de API)
EXPOSE 80 8000

# Comando para rodar o Nginx e o Node.js juntos
ENTRYPOINT [ "sh", "-c", "node /proxy/proxy.js & nginx -g 'daemon off;'" ]

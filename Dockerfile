# Estágio 1: Build (Compila o React)
# Usamos a imagem do Node.js para compilar seu código .tsx em arquivos estáticos
FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --ignore-scripts

COPY . .
# Roda o "npm run build" para criar a pasta /build
RUN npm run build

# Estágio 2: Serve (Usa um servidor leve)
# Usamos um servidor web leve (Nginx) SÓ para servir os arquivos estáticos
FROM nginx:1.21-alpine

# Copia os arquivos estáticos da pasta /build (do estágio 1)
# para a pasta de site padrão do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80 (padrão do Nginx)
EXPOSE 80

# O Nginx inicia sozinho
CMD ["nginx", "-g", "daemon off;"]
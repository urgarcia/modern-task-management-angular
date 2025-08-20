#!/bin/bash

# Script de deployment que usa archivo .env
# Uso: ./deploy/deploy-with-env.sh

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Cargar configuración desde .env
ENV_FILE="$(dirname "$0")/.env"
if [ -f "$ENV_FILE" ]; then
    echo -e "${YELLOW}📋 Cargando configuración desde .env...${NC}"
    source "$ENV_FILE"
else
    echo -e "${RED}❌ Error: No se encuentra el archivo .env en la carpeta deploy/${NC}"
    echo -e "${YELLOW}💡 Crea el archivo usando: cp deploy/.env.example deploy/.env${NC}"
    exit 1
fi

# Verificar variables requeridas
if [ -z "$EC2_HOST" ] || [ -z "$KEY_PATH" ] || [ -z "$EC2_USER" ]; then
    echo -e "${RED}❌ Error: Variables faltantes en .env${NC}"
    echo -e "${YELLOW}Verifica que tengas configurado: EC2_HOST, KEY_PATH, EC2_USER${NC}"
    exit 1
fi

echo -e "${YELLOW}🚀 Deployment automático con configuración .env...${NC}"
echo -e "${YELLOW}📍 Servidor: ${EC2_HOST}${NC}"
echo -e "${YELLOW}👤 Usuario: ${EC2_USER}${NC}"
echo -e "${YELLOW}🔑 Key: ${KEY_PATH}${NC}"

# Verificar que el archivo key existe
if [ ! -f "$KEY_PATH" ]; then
    echo -e "${RED}❌ Error: No se encuentra el archivo key: $KEY_PATH${NC}"
    exit 1
fi

# Verificar permisos del key
KEY_PERMS=$(stat -c "%a" "$KEY_PATH")
if [ "$KEY_PERMS" != "400" ]; then
    echo -e "${YELLOW}⚠️  Ajustando permisos del key...${NC}"
    chmod 400 "$KEY_PATH"
fi

# Construir aplicación
echo -e "${YELLOW}📦 Construyendo aplicación...${NC}"
npm run build:static

# Crear archivo comprimido
echo -e "${YELLOW}📁 Comprimiendo archivos...${NC}"
cd dist/angular-example/browser
tar -czf ../../../app-deploy.tar.gz *
cd ../../..

# Subir archivo
echo -e "${YELLOW}📤 Subiendo a EC2...${NC}"
scp -o StrictHostKeyChecking=no -i "$KEY_PATH" app-deploy.tar.gz $EC2_USER@$EC2_HOST:/tmp/

# Desplegar en servidor
echo -e "${YELLOW}⚙️  Configurando servidor...${NC}"
ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" $EC2_USER@$EC2_HOST << EOF
    echo "Actualizando sistema..."
    sudo yum update -y
    
    echo "Instalando Nginx..."
    sudo yum install -y nginx
    
    echo "Configurando aplicación..."
    sudo rm -rf /usr/share/nginx/html/*
    cd /usr/share/nginx/html
    sudo tar -xzf /tmp/app-deploy.tar.gz
    sudo chown -R nginx:nginx /usr/share/nginx/html
    sudo chmod -R 755 /usr/share/nginx/html
    
    echo "Limpiando configuraciones antiguas de Nginx..."
    sudo rm -f /etc/nginx/conf.d/default.conf
    sudo rm -f /etc/nginx/conf.d/angular-app.conf
    
    echo "Configurando Nginx para SPA..."
    sudo tee /etc/nginx/conf.d/angular-spa.conf > /dev/null << 'NGINX_CONFIG'
server {
    listen 80;
    listen [::]:80;
    
    root /usr/share/nginx/html;
    index index.html;
    server_name _;

    # Handle Angular routing (SPA)
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
NGINX_CONFIG
    
    echo "Verificando y reiniciando Nginx..."
    sudo nginx -t && sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo "Verificando estado de Nginx..."
    sudo systemctl status nginx --no-pager
    
    echo "Limpiando archivos temporales..."
    rm /tmp/app-deploy.tar.gz
    
    echo "✅ ¡Deployment completado!"
EOF

# Limpiar archivo local
rm app-deploy.tar.gz

echo -e "${GREEN}🎉 ¡Deployment exitoso!${NC}"
echo -e "${GREEN}🌐 Tu aplicación está disponible en: http://${EC2_HOST}${NC}"
echo -e "${YELLOW}💡 Para SSL y dominio personalizado, consulta la documentación en deploy/README.md${NC}"

# Verificar que la aplicación responde
echo -e "${YELLOW}🔍 Verificando que la aplicación responde...${NC}"
if curl -s -o /dev/null -w "%{http_code}" "http://${EC2_HOST}" | grep -q "200"; then
    echo -e "${GREEN}✅ La aplicación responde correctamente!${NC}"
else
    echo -e "${YELLOW}⚠️  La aplicación puede tardar unos segundos en responder${NC}"
fi

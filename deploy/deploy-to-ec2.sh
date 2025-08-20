#!/bin/bash

# Script para deployar aplicación Angular en EC2
# Ejecutar desde la carpeta raíz del proyecto: ./deploy/deploy-to-ec2.sh

set -e

echo "🚀 Iniciando deployment en EC2..."

# Variables (Configúralas con tus valores)
EC2_HOST="tu-ec2-ip-address"
EC2_USER="ubuntu"  # o ec2-user para Amazon Linux
KEY_PATH="~/.ssh/tu-key.pem"
DEPLOY_PATH="/var/www/html"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Construyendo aplicación...${NC}"
npm run build:static

echo -e "${YELLOW}📁 Creando archivo comprimido...${NC}"
cd dist/angular-example/browser
tar -czf ../../../app-deploy.tar.gz *
cd ../../..

echo -e "${YELLOW}📤 Subiendo archivos al servidor...${NC}"
scp -i $KEY_PATH app-deploy.tar.gz $EC2_USER@$EC2_HOST:/tmp/

echo -e "${YELLOW}⚙️  Configurando servidor...${NC}"
ssh -i $KEY_PATH $EC2_USER@$EC2_HOST << 'EOF'
    # Actualizar sistema
    sudo apt update
    
    # Instalar nginx si no está instalado
    if ! command -v nginx &> /dev/null; then
        echo "Instalando Nginx..."
        sudo apt install -y nginx
    fi
    
    # Crear backup si existe contenido anterior
    if [ -d "/var/www/html" ] && [ "$(ls -A /var/www/html)" ]; then
        sudo cp -r /var/www/html /var/www/html.backup.$(date +%Y%m%d_%H%M%S)
    fi
    
    # Limpiar directorio web
    sudo rm -rf /var/www/html/*
    
    # Extraer nueva aplicación
    cd /var/www/html
    sudo tar -xzf /tmp/app-deploy.tar.gz
    
    # Establecer permisos correctos
    sudo chown -R www-data:www-data /var/www/html
    sudo chmod -R 755 /var/www/html
    
    # Limpiar archivo temporal
    rm /tmp/app-deploy.tar.gz
    
    # Configurar nginx para Angular (SPA)
    sudo tee /etc/nginx/sites-available/angular-app > /dev/null << 'NGINX_CONF'
server {
    listen 80;
    listen [::]:80;
    server_name _;
    root /var/www/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    # Handle Angular routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
        add_header Expires "0";
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
NGINX_CONF
    
    # Activar sitio
    sudo ln -sf /etc/nginx/sites-available/angular-app /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
    
    # Verificar configuración nginx
    sudo nginx -t
    
    # Reiniciar nginx
    sudo systemctl restart nginx
    
    # Habilitar nginx al inicio
    sudo systemctl enable nginx
    
    echo "✅ Nginx configurado y reiniciado"
EOF

# Limpiar archivo local
rm app-deploy.tar.gz

echo -e "${GREEN}🎉 ¡Deployment completado!${NC}"
echo -e "${GREEN}📱 Tu aplicación está disponible en: http://${EC2_HOST}${NC}"
echo -e "${YELLOW}💡 No olvides configurar un dominio y SSL en producción${NC}"

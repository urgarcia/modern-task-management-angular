#!/bin/bash

# Script simplificado para deployment manual en EC2
# Uso: ./deploy/quick-deploy.sh [IP_EC2] [RUTA_KEY]

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Verificar argumentos
if [ $# -lt 2 ]; then
    echo -e "${RED}❌ Error: Faltan argumentos${NC}"
    echo -e "${YELLOW}Uso: $0 <IP_EC2> <RUTA_KEY>${NC}"
    echo -e "${YELLOW}Ejemplo: $0 52.91.123.456 ~/.ssh/mi-key.pem${NC}"
    exit 1
fi

EC2_HOST=$1
KEY_PATH=$2
EC2_USER="ec2-user"  # Amazon Linux usa ec2-user

echo -e "${YELLOW}🚀 Deployment rápido a EC2...${NC}"
echo -e "${YELLOW}📍 Servidor: ${EC2_HOST}${NC}"
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
ssh -o StrictHostKeyChecking=no -i "$KEY_PATH" $EC2_USER@$EC2_HOST << 'EOF'
    echo "Actualizando sistema..."
    sudo yum update -y
    
    echo "Instalando Nginx..."
    sudo amazon-linux-extras install nginx1 -y
    
    echo "Configurando aplicación..."
    sudo rm -rf /usr/share/nginx/html/*
    cd /usr/share/nginx/html
    sudo tar -xzf /tmp/app-deploy.tar.gz
    sudo chown -R nginx:nginx /usr/share/nginx/html
    sudo chmod -R 755 /usr/share/nginx/html
    
    echo "Configurando Nginx para SPA..."
    sudo tee /etc/nginx/conf.d/default.conf > /dev/null << 'NGINX_CONFIG'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /usr/share/nginx/html;
    index index.html;
    server_name _;

    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
NGINX_CONFIG
    
    echo "Reiniciando Nginx..."
    sudo nginx -t && sudo systemctl restart nginx
    sudo systemctl enable nginx
    
    echo "Limpiando archivos temporales..."
    rm /tmp/app-deploy.tar.gz
    
    echo "✅ ¡Deployment completado!"
EOF

# Limpiar archivo local
rm app-deploy.tar.gz

echo -e "${GREEN}🎉 ¡Deployment exitoso!${NC}"
echo -e "${GREEN}🌐 Tu aplicación está disponible en: http://${EC2_HOST}${NC}"
echo -e "${YELLOW}💡 Para SSL y dominio personalizado, consulta la documentación en deploy/README.md${NC}"

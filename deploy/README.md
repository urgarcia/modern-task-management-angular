# Guía de Deployment en AWS EC2

## 🎯 Resumen
Esta guía te ayudará a desplegar tu aplicación Angular en una instancia EC2 de AWS como una página estática usando Nginx.

## 📋 Prerrequisitos

### 1. Instancia EC2
- **Tipo recomendado**: t3.micro (elegible para capa gratuita)
- **AMI**: Ubuntu Server 20.04 LTS o Amazon Linux 2
- **Security Group**: Permitir tráfico HTTP (puerto 80) y SSH (puerto 22)
- **Key Pair**: Tener tu archivo .pem descargado

### 2. Configuración Local
- Node.js y npm instalados
- Acceso SSH a tu instancia EC2
- Aplicación Angular construida correctamente

## 🚀 Pasos de Deployment

### Opción A: Deployment Automático (Recomendado)

1. **Configurar variables en el script**:
   ```bash
   # Editar deploy/deploy-to-ec2.sh
   EC2_HOST="tu-ip-publica-ec2"           # Ejemplo: 52.91.123.456
   EC2_USER="ubuntu"                       # o "ec2-user" para Amazon Linux
   KEY_PATH="~/.ssh/tu-key.pem"          # Ruta a tu archivo .pem
   ```

2. **Dar permisos de ejecución**:
   ```bash
   chmod +x deploy/deploy-to-ec2.sh
   ```

3. **Ejecutar deployment**:
   ```bash
   ./deploy/deploy-to-ec2.sh
   ```

### Opción B: Deployment Manual

1. **Construir la aplicación**:
   ```bash
   npm run build:static
   ```

2. **Comprimir archivos**:
   ```bash
   cd dist/angular-example/browser
   tar -czf app.tar.gz *
   ```

3. **Subir a EC2**:
   ```bash
   scp -i ~/.ssh/tu-key.pem app.tar.gz ubuntu@tu-ip-ec2:/tmp/
   ```

4. **Conectar a EC2 y configurar**:
   ```bash
   ssh -i ~/.ssh/tu-key.pem ubuntu@tu-ip-ec2
   
   # En el servidor EC2:
   sudo apt update
   sudo apt install -y nginx
   sudo rm -rf /var/www/html/*
   cd /var/www/html
   sudo tar -xzf /tmp/app.tar.gz
   sudo chown -R www-data:www-data /var/www/html
   ```

5. **Configurar Nginx**:
   ```bash
   sudo nano /etc/nginx/sites-available/angular-app
   ```
   
   Copiar la configuración del archivo `nginx.conf` incluido.

6. **Activar sitio**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/angular-app /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## 🔧 Scripts npm Disponibles

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "build:static": "ng build --configuration=static",
    "deploy": "./deploy/deploy-to-ec2.sh",
    "deploy:build": "npm run build:static && ./deploy/deploy-to-ec2.sh"
  }
}
```

## 🌐 Configuración de Dominio (Opcional)

### Con Route 53 y Elastic IP:

1. **Asignar Elastic IP**:
   - Ve a EC2 > Elastic IPs
   - Allocate new address
   - Associate with your instance

2. **Configurar Route 53**:
   - Create hosted zone for your domain
   - Add A record pointing to your Elastic IP

3. **SSL con Let's Encrypt**:
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tudominio.com
   ```

## 🔍 Troubleshooting

### Problema: "Connection refused"
- Verificar Security Group permite puerto 80
- Verificar nginx está corriendo: `sudo systemctl status nginx`

### Problema: "404 en rutas de Angular"
- Verificar configuración nginx incluye `try_files $uri $uri/ /index.html;`

### Problema: "Permission denied"
- Verificar permisos: `sudo chown -R www-data:www-data /var/www/html`

### Verificar logs:
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## 💰 Costos Estimados

- **t3.micro**: ~$8.50/mes (gratis primer año con Free Tier)
- **Elastic IP**: Gratis si está asociada a instancia corriendo
- **Tráfico**: 1GB gratis/mes, luego ~$0.09/GB

## 🔐 Mejores Prácticas de Seguridad

1. **Cambiar puerto SSH**: Editar `/etc/ssh/sshd_config`
2. **Configurar fail2ban**: `sudo apt install fail2ban`
3. **Actualizaciones automáticas**: `sudo apt install unattended-upgrades`
4. **Firewall**: Configurar ufw o usar Security Groups restrictivos
5. **Backups**: Usar EBS snapshots automáticos

## 🎉 ¡Listo!

Tu aplicación Angular estará disponible en: `http://tu-ip-ec2`

Para actualizaciones futuras, simplemente ejecuta:
```bash
npm run deploy
```

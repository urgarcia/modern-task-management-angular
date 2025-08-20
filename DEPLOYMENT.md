# 🚀 DEPLOYMENT RÁPIDO - Instrucciones

## ✅ ¿Qué tienes listo?

Tu aplicación Angular ya está preparada para deployment con:
- ✅ Build estático configurado (`npm run build:static`)
- ✅ Scripts de deployment automático
- ✅ Configuración de Nginx optimizada
- ✅ Documentación completa

## 🎯 Pasos para deployar

### 1. Crear instancia EC2 en AWS

1. **Ir a AWS Console > EC2**
2. **Launch Instance**:
   - **AMI**: Ubuntu Server 20.04 LTS (Free Tier)
   - **Instance Type**: t3.micro (Free Tier)
   - **Key Pair**: Crear/seleccionar una key pair y descargar el archivo .pem
   - **Security Group**: 
     - SSH (22) - Tu IP
     - HTTP (80) - Anywhere (0.0.0.0/0)
     - HTTPS (443) - Anywhere (0.0.0.0/0) [opcional para SSL]

3. **Launch** y esperar que esté "running"
4. **Anotar la IP pública** (ej: 52.91.123.456)

### 2. Desplegar tu aplicación

**Opción A - Script Rápido (Recomendado)**:
```bash
./deploy/quick-deploy.sh TU-IP-EC2 ~/.ssh/tu-key.pem
```

**Ejemplo**:
```bash
./deploy/quick-deploy.sh 52.91.123.456 ~/.ssh/mi-proyecto-key.pem
```

**Opción B - Manual**:
1. Editar `deploy/deploy-to-ec2.sh` con tus datos
2. Ejecutar: `./deploy/deploy-to-ec2.sh`

### 3. ¡Listo! 🎉

Tu aplicación estará disponible en: **http://TU-IP-EC2**

## 🔧 Para actualizaciones futuras

```bash
# Hacer cambios en tu código
# Luego ejecutar:
./deploy/quick-deploy.sh TU-IP-EC2 ~/.ssh/tu-key.pem
```

## 🌐 Configuración de dominio (Opcional)

### Si tienes un dominio:

1. **Elastic IP** (para IP fija):
   - EC2 > Elastic IPs > Allocate
   - Associate con tu instancia

2. **DNS**:
   - Apuntar tu dominio A-record a la Elastic IP
   - O usar Route 53 de AWS

3. **SSL gratuito**:
   ```bash
   ssh -i ~/.ssh/tu-key.pem ubuntu@tu-ip-ec2
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tudominio.com
   ```

## 💡 Tips importantes

- **Costos**: t3.micro es GRATIS el primer año
- **Security**: Tu key .pem debe tener permisos 400
- **Updates**: Solo ejecuta el script para actualizar
- **Logs**: `ssh` al servidor y ver `/var/log/nginx/`

## 🆘 Problemas comunes

**"Connection refused"**: Verificar Security Group permite puerto 80
**"Permission denied"**: Verificar permisos de key: `chmod 400 ~/.ssh/tu-key.pem`
**"404 en rutas"**: El script ya configura correctamente el nginx para Angular SPA

---

### 📞 Para la entrevista técnica

Puedes compartir simplemente la IP pública: **http://tu-ip-ec2**

¡Tu aplicación con el diseño glassmorphism profesional estará disponible públicamente! 🌟

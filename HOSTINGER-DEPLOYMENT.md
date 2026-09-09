# Hostinger VPS Deployment Guide

Complete guide to deploy QTM Group website to Hostinger VPS.

## Prerequisites

- Hostinger VPS with Ubuntu 22.04 LTS or newer
- SSH access to your server
- Domain pointing to your Hostinger server
- Resend API key (see EMAIL-SETUP.md)

## Step 1: Initial Server Setup

Connect to your Hostinger VPS via SSH:

```bash
ssh root@your_server_ip
```

Update system:
```bash
apt update && apt upgrade -y
```

Install required packages:
```bash
apt install -y curl git wget build-essential
```

## Step 2: Install Docker & Docker Compose

Install Docker:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker root
```

Install Docker Compose:
```bash
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

Verify installation:
```bash
docker --version
docker-compose --version
```

## Step 3: Clone Your Repository

Create app directory:
```bash
mkdir -p /var/www/qtm-group
cd /var/www/qtm-group
```

Clone from GitHub:
```bash
git clone https://github.com/ddeem7737/QTM-Website.git .
```

## Step 4: Set Up Environment Variables

Create production environment file:
```bash
cat > .env.production << EOF
NODE_ENV=production
RESEND_API_KEY=re_your_api_key_here
EOF
```

Replace `re_your_api_key_here` with your actual Resend API key.

## Step 5: Set Up SSL Certificate

Install Certbot:
```bash
apt install -y certbot python3-certbot-nginx
```

Create SSL directory:
```bash
mkdir -p /var/www/qtm-group/ssl
```

Generate certificate:
```bash
certbot certonly --standalone -d qtm-group.com -d www.qtm-group.com --email info@qtm-group.com
```

Copy certificates to your app directory:
```bash
cp /etc/letsencrypt/live/qtm-group.com/fullchain.pem /var/www/qtm-group/ssl/cert.pem
cp /etc/letsencrypt/live/qtm-group.com/privkey.pem /var/www/qtm-group/ssl/key.pem
chmod 644 /var/www/qtm-group/ssl/cert.pem
chmod 600 /var/www/qtm-group/ssl/key.pem
```

## Step 6: Configure DNS

In Hostinger control panel:
1. Go to DNS Records
2. Set A record: `qtm-group.com` → your VPS IP
3. Set A record: `www.qtm-group.com` → your VPS IP
4. Wait 5-15 minutes for DNS propagation

Verify DNS:
```bash
nslookup qtm-group.com
```

## Step 7: Build and Run Docker Containers

Navigate to your app directory:
```bash
cd /var/www/qtm-group
```

Build Docker image:
```bash
docker-compose build
```

Start services:
```bash
docker-compose up -d
```

Verify containers are running:
```bash
docker-compose ps
```

Check logs:
```bash
docker-compose logs qtm-website
docker-compose logs qtm-nginx
```

## Step 8: Set Up Auto-Renewal for SSL

Create renewal cron job:
```bash
crontab -e
```

Add this line:
```
0 3 * * * certbot renew --quiet && cp /etc/letsencrypt/live/qtm-group.com/fullchain.pem /var/www/qtm-group/ssl/cert.pem && cp /etc/letsencrypt/live/qtm-group.com/privkey.pem /var/www/qtm-group/ssl/key.pem && docker-compose -f /var/www/qtm-group/docker-compose.yml restart nginx
```

## Step 9: Test Your Website

Visit:
- https://qtm-group.com
- https://www.qtm-group.com

Test form submission on any contact/inquiry page.

## Step 10: Set Up Monitoring & Auto-Restart

Create a monitoring script:
```bash
cat > /usr/local/bin/docker-monitor.sh << 'EOF'
#!/bin/bash
cd /var/www/qtm-group
docker-compose ps -q | xargs -r docker stats --no-stream > /dev/null 2>&1
if [ $? -ne 0 ]; then
    docker-compose restart
fi
EOF

chmod +x /usr/local/bin/docker-monitor.sh
```

Add to crontab (runs every 5 minutes):
```bash
*/5 * * * * /usr/local/bin/docker-monitor.sh
```

## Useful Commands

**View logs:**
```bash
docker-compose logs -f qtm-website
docker-compose logs -f qtm-nginx
```

**Restart containers:**
```bash
docker-compose restart
```

**Stop containers:**
```bash
docker-compose down
```

**Update code from GitHub:**
```bash
cd /var/www/qtm-group
git pull origin main
docker-compose build
docker-compose up -d
```

**Check disk space:**
```bash
df -h
du -sh /var/www/qtm-group
```

**View resource usage:**
```bash
docker stats
```

## Troubleshooting

**Port 80/443 already in use:**
```bash
lsof -i :80
lsof -i :443
kill -9 <PID>
```

**Container crashes:**
```bash
docker-compose logs qtm-website
```

**Email not sending:**
- Verify `RESEND_API_KEY` is set correctly in `.env.production`
- Check container logs: `docker-compose logs qtm-website`
- Test Resend key at: https://resend.com/api-keys

**SSL certificate not working:**
```bash
# Renew manually
certbot renew --force-renewal
# Copy to Docker
cp /etc/letsencrypt/live/qtm-group.com/fullchain.pem /var/www/qtm-group/ssl/cert.pem
cp /etc/letsencrypt/live/qtm-group.com/privkey.pem /var/www/qtm-group/ssl/key.pem
# Restart nginx
docker-compose restart nginx
```

## Backup Strategy

Backup code and data weekly:
```bash
tar -czf qtm-backup-$(date +%Y%m%d).tar.gz /var/www/qtm-group
```

Store backups safely.

## Performance Optimization

Your current setup includes:
- ✅ Gzip compression
- ✅ HTTP/2
- ✅ Asset caching (30 days)
- ✅ Security headers
- ✅ Auto SSL renewal

## Maintenance Checklist

- [ ] Weekly: Check logs for errors
- [ ] Monthly: Update Docker images (`docker-compose pull`)
- [ ] Monthly: Verify SSL certificate renewal
- [ ] Quarterly: Review security settings
- [ ] Quarterly: Test database backups
- [ ] Annually: Security audit

## Support

- Hostinger: https://www.hostinger.com/help
- Docker: https://docs.docker.com/
- Nginx: https://nginx.org/en/docs/
- Certbot: https://certbot.eff.org/

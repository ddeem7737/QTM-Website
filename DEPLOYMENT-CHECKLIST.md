# QTM Group Website - Deployment Checklist

Track your deployment progress:

## ✅ LOCAL DEVELOPMENT
- [x] Website code complete
- [x] Email system implemented (Resend)
- [x] Forms functional
- [x] Website tested locally
- [x] GitHub repository created
- [x] wrangler.toml configured

## ✅ PRE-DEPLOYMENT
- [x] Removed unnecessary files (examples/, tests/)
- [x] All dependencies configured
- [x] Docker configured
- [x] Nginx configured
- [x] Environment variables documented

## ⏳ HOSTINGER SETUP (DO THIS NOW)

### Server Access
- [ ] Purchase/access Hostinger VPS
- [ ] Receive server IP and login credentials
- [ ] SSH into server successfully
- [ ] Update server: `apt update && apt upgrade -y`

### Prerequisites Installed
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Git installed
- [ ] Certbot installed (for SSL)

### Application Deployment
- [ ] Create `/var/www/qtm-group` directory
- [ ] Clone GitHub repository
- [ ] Create `.env.production` file
- [ ] Add Resend API key to `.env.production`
- [ ] Build Docker image: `docker-compose build`
- [ ] Start containers: `docker-compose up -d`
- [ ] Verify containers running: `docker-compose ps`

### SSL Certificate
- [ ] Generate SSL certificate with Certbot
- [ ] Copy certificates to `/var/www/qtm-group/ssl/`
- [ ] Update Nginx certificate paths
- [ ] Test HTTPS connection

### DNS Configuration
- [ ] Point `qtm-group.com` A record to server IP
- [ ] Point `www.qtm-group.com` A record to server IP
- [ ] Wait for DNS propagation (5-15 min)
- [ ] Verify DNS: `nslookup qtm-group.com`

## 🧪 TESTING
- [ ] Website loads at https://qtm-group.com
- [ ] Website loads at https://www.qtm-group.com
- [ ] HTTP redirects to HTTPS
- [ ] www redirects to non-www
- [ ] All pages load correctly
- [ ] Forms display properly
- [ ] Submit test contact form
- [ ] Verify email received at info@qtm-group.com
- [ ] Check Nginx logs for errors
- [ ] Check application logs for errors

## 🔒 SECURITY
- [ ] SSL certificate active (green lock)
- [ ] HSTS header enabled
- [ ] Security headers configured
- [ ] Firewall configured on Hostinger
- [ ] Resend API key NOT in git
- [ ] Environment variables set on server
- [ ] Nginx security headers active

## 🔄 MONITORING & MAINTENANCE
- [ ] Set up SSL auto-renewal
- [ ] Configure monitoring cron job
- [ ] Set up backup strategy
- [ ] Document admin procedures
- [ ] Save server login credentials securely

## 📊 FINAL CHECKLIST
- [ ] Website fully operational
- [ ] All forms working
- [ ] Emails sending successfully
- [ ] SSL certificate valid
- [ ] Performance acceptable
- [ ] Security headers present
- [ ] Mobile responsive
- [ ] All content displays correctly
- [ ] Analytics ready (if needed)
- [ ] Admin access secured

## 🚀 LAUNCH READY
- [ ] Announce launch
- [ ] Monitor for issues first 24 hours
- [ ] Gather user feedback
- [ ] Keep logs for troubleshooting

---

## Quick Command Reference

```bash
# SSH into server
ssh root@your_server_ip

# Navigate to app
cd /var/www/qtm-group

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Restart
docker-compose restart

# Update from GitHub
git pull origin main
docker-compose build
docker-compose up -d

# Check certificate
certbot certificates
```

---

## Important Files
- `HOSTINGER-DEPLOYMENT.md` - Full deployment guide
- `EMAIL-SETUP.md` - Email system configuration
- `Dockerfile` - Container configuration
- `docker-compose.yml` - Services orchestration
- `nginx.conf` - Web server configuration
- `.env.production` - Production variables (DO NOT COMMIT)

---

## Support
- Deployment issues: See HOSTINGER-DEPLOYMENT.md
- Email issues: See EMAIL-SETUP.md
- Code issues: Check GitHub repository
- Hostinger support: https://www.hostinger.com/help

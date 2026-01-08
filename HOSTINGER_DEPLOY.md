# Hostinger Deployment Guide - ServiceHub Pro

## Prerequisites
- Hostinger VPS or Node.js hosting plan
- Node.js 20+ installed on server
- PostgreSQL database (Supabase recommended or Hostinger managed PostgreSQL)
- SSH access to your server

## Step 1: Build the Application

On your local machine or Replit:

```bash
# Install dependencies
npm install

# Build for production
npm run build
```

This will create:
- `dist/index.cjs` - Server bundle
- `dist/public/` - Client static files

## Step 2: Upload to Hostinger

### Option A: Using Git
```bash
# On Hostinger server
git clone https://github.com/your-repo/servicehub-pro.git
cd servicehub-pro
npm ci --production
npm run build
```

### Option B: Using FTP/SFTP
1. Upload entire project folder
2. SSH into server and run:
```bash
npm ci --production
npm run build
```

## Step 3: Configure Environment Variables

1. Create `.env` file on server (copy from `.env.example`):
```bash
cp .env.example .env
nano .env
```

2. Fill in all required values:
- `NODE_ENV=production`
- `PORT=3000` (or your preferred port)
- `DATABASE_URL` or `SUPABASE_DB_URL`
- `SUPABASE_URL` and `SUPABASE_ANON_KEY`
- `TWOFACTOR_API_KEY`
- `SESSION_SECRET`

## Step 4: Run Database Migrations

```bash
npm run db:push
```

## Step 5: Start the Application

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/index.cjs --name "servicehub-pro"

# Save PM2 configuration
pm2 save

# Set PM2 to start on server reboot
pm2 startup
```

### Using Systemd
Create `/etc/systemd/system/servicehub.service`:
```ini
[Unit]
Description=ServiceHub Pro
After=network.target

[Service]
Type=simple
User=your_user
WorkingDirectory=/path/to/servicehub-pro
ExecStart=/usr/bin/node dist/index.cjs
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl enable servicehub
sudo systemctl start servicehub
```

## Step 6: Configure Nginx (Reverse Proxy)

Create `/etc/nginx/sites-available/servicehub`:
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/servicehub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: SSL Certificate (HTTPS)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Troubleshooting

### Check application logs
```bash
pm2 logs servicehub-pro
```

### Check if port is in use
```bash
netstat -tulpn | grep 3000
```

### Restart application
```bash
pm2 restart servicehub-pro
```

## Important Notes

1. **Database**: Supabase database works from anywhere. No migration needed.
2. **Object Storage**: Replit Object Storage won't work on Hostinger. Use AWS S3 or similar for file uploads.
3. **Environment Variables**: Never commit `.env` to git. Add it to `.gitignore`.
4. **Security**: Ensure firewall allows only ports 80, 443, and SSH.

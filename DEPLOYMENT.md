# Deployment Guide

## 🚀 Deploy to Production

### Build the Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# The build output will be in the `dist/` directory
```

### Static Hosting

The application is a static SPA (Single Page Application) and can be deployed to any static hosting service.

#### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

#### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Or connect your GitHub repository to Netlify.

#### GitHub Pages

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to GitHub Pages

3. Update `vite.config.js` if needed:
   ```javascript
   export default defineConfig({
     base: '/your-repo-name/',
     // ... rest of config
   })
   ```

#### AWS S3 + CloudFront

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload `dist/` to S3 bucket

3. Configure CloudFront distribution

4. Set up S3 bucket for static website hosting

#### Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `nginx.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Build and run:

```bash
docker build -t scorm-studio .
docker run -p 80:80 scorm-studio
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Variables

- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

### AI Configuration (Optional)

- `VITE_AI_ENABLED`: Enable/disable AI features
- `VITE_AI_PROVIDER`: AI provider (ollama, openai)
- `VITE_OLLAMA_BASE_URL`: Ollama API URL
- `VITE_OLLAMA_MODEL`: Ollama model name
- `VITE_OPENAI_API_KEY`: OpenAI API key (if using OpenAI)

## 🔄 CI/CD

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        vercel-args: '--prod'
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
image: node:18

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/

deploy:
  stage: deploy
  script:
    - echo "Deploy to production"
  only:
    - main
```

## 📊 Monitoring

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Bugsnag

### Analytics

Consider integrating:
- Google Analytics
- Plausible
- Fathom

## 🔒 Security

### HTTPS

Always use HTTPS in production. Most hosting providers offer free SSL certificates.

### Security Headers

Add security headers in your hosting configuration:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

### Environment Variables

Never commit `.env` files with sensitive data. Use your hosting provider's environment variable management.

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Routing Issues

If you get 404 errors on page refresh, ensure your hosting is configured to serve `index.html` for all routes (SPA fallback).

### Performance Issues

- Enable gzip/brotli compression on your server
- Use a CDN for static assets
- Optimize images before uploading
- Enable browser caching

## 📞 Support

For deployment issues:
1. Check the [README.md](README.md)
2. Search existing [issues](../../issues)
3. Create a new issue with deployment label

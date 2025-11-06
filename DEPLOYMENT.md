# 🚀 Deployment Guide

## GitHub Pages Deployment

### Step 1: Push to GitHub

```bash
cd /Users/vikaskumar.singh/opensource/System-Design/Daily-Longevity-Tracker

git add .
git commit -m "Setup repository"
git push -u origin main
```

### Step 2: Enable GitHub Pages

1. Go to: **https://github.com/singh-vikas/Daily-Longevity-Tracker/settings/pages**
2. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/docs`
3. Click **Save**

### Step 3: Access Your Tracker

Your tracker will be live at:
```
https://singh-vikas.github.io/Daily-Longevity-Tracker/
```

Wait 1-2 minutes for GitHub to build and deploy.

## Alternative: GitHub Actions

The repository includes a GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) that automatically deploys from the `web-app` folder when changes are pushed.

To use Actions:
1. Go to repository Settings → Pages
2. Select **GitHub Actions** as the source
3. The workflow will automatically deploy

---

**That's it!** Your tracker is now live on GitHub Pages.


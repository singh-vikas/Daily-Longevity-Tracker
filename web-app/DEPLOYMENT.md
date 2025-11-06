# 🚀 Deployment Guide - GitHub Pages

This guide will help you deploy the Daily Tracker web app to GitHub Pages.

## 📋 Prerequisites

1. GitHub account
2. Repository with the tracker files
3. GitHub Pages enabled

## 🎯 Step-by-Step Deployment

### Option 1: Deploy to Main Repository (Recommended)

#### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select:
   - **Branch**: `main` (or your default branch)
   - **Folder**: `/Health/Longevity/Daily_Tracker_System/web-app`
4. Click **Save**

#### Step 2: Access Your Site

Your site will be available at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/Health/Longevity/Daily_Tracker_System/web-app/
```

**Example:**
```
https://singh-vikas.github.io/Obsidian-Vault/Health/Longevity/Daily_Tracker_System/web-app/
```

### Option 2: Deploy to Separate Branch (Alternative)

#### Step 1: Create gh-pages Branch

```bash
# Create and switch to gh-pages branch
git checkout -b gh-pages

# Copy files to root
cp -r Health/Longevity/Daily_Tracker_System/web-app/* .

# Commit and push
git add .
git commit -m "Deploy tracker to GitHub Pages"
git push origin gh-pages
```

#### Step 2: Enable GitHub Pages

1. Go to **Settings** → **Pages**
2. Select **gh-pages** branch
3. Select `/ (root)` folder
4. Click **Save**

Your site will be at:
```
https://YOUR_USERNAME.github.io/REPO_NAME/
```

## 🔧 GitHub Actions Automation (Optional)

Create `.github/workflows/deploy-pages.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
    paths:
      - 'Health/Longevity/Daily_Tracker_System/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Pages
        uses: actions/configure-pages@v3
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: 'Health/Longevity/Daily_Tracker_System'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v2
```

## 📱 Custom Domain (Optional)

1. Add `CNAME` file in `Daily_Tracker_System/web-app/` folder:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

## 🎨 Customization

### Update Base Path

If deploying to a subdirectory, update paths in `index.html`:

```html
<!-- Add base tag if needed -->
<base href="/Health/Longevity/Daily_Tracker_System/">
```

### Update Repository Links

Edit references in documentation files to match your deployment URL.

## ✅ Verification Checklist

- [ ] GitHub Pages enabled
- [ ] Files in correct folder
- [ ] `.nojekyll` file present (prevents Jekyll processing)
- [ ] Site accessible at URL
- [ ] All JavaScript files load correctly
- [ ] CSS styles applied
- [ ] LocalStorage works (test in browser)

## 🐛 Troubleshooting

### Issue: 404 Error

**Solution:**
- Check folder path in GitHub Pages settings
- Verify files are in correct location
- Wait 5-10 minutes for changes to propagate

### Issue: CSS/JS Not Loading

**Solution:**
- Check browser console for errors
- Verify file paths are correct
- Ensure `.nojekyll` file exists
- Clear browser cache

### Issue: LocalStorage Not Working

**Solution:**
- Use HTTPS (GitHub Pages provides this automatically)
- Check browser console for errors
- Test in incognito mode

## 📊 Accessing Your Site

Once deployed, you can:

1. **Share the URL** with others
2. **Bookmark it** for daily use
3. **Add to home screen** on mobile devices
4. **Track data** that persists in browser localStorage

## 🔄 Updating the Site

1. Make changes to files
2. Commit and push to repository
3. Changes appear on site within 1-5 minutes

## 📝 Notes

- Data is stored in browser localStorage (client-side only)
- For backup, export data regularly
- Consider adding cloud sync (future enhancement)
- Site works offline after first load (PWA potential)

---

**Need help?** Check GitHub Pages documentation or open an issue.


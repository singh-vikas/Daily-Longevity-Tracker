# 🚀 Manual Push Instructions

If the automated script doesn't work, follow these steps manually:

## Step 1: Navigate to Repository

```bash
cd /Users/vikaskumar.singh/opensource/System-Design/Daily-Longevity-Tracker
```

## Step 2: Initialize Git (if needed)

```bash
git init
```

## Step 3: Copy Files (if repository is empty)

```bash
# Copy from source
cp -r /Users/vikaskumar.singh/opensource/System-Design/Obsidian-Vault/Health/Longevity/Daily_Tracker_System/* .
```

## Step 4: Add Remote

```bash
git remote add origin https://github.com/singh-vikas/Daily-Longevity-Tracker.git
```

Or if remote already exists:
```bash
git remote set-url origin https://github.com/singh-vikas/Daily-Longevity-Tracker.git
```

## Step 5: Add All Files

```bash
git add -A
```

## Step 6: Commit

```bash
git commit -m "Initial commit: Daily Longevity Tracker

- Complete tracker system with markdown and web app
- Productivity scoring and report generation
- Science-based protocols from longevity research
- Ready for GitHub Pages deployment"
```

## Step 7: Set Branch to Main

```bash
git branch -M main
```

## Step 8: Push to GitHub

```bash
git push -u origin main
```

If you get an error about the remote having content, use:
```bash
git push -u origin main --force
```

## Step 9: Enable GitHub Pages

1. Go to: https://github.com/singh-vikas/Daily-Longevity-Tracker/settings/pages
2. Under **Source**, select:
   - **Branch**: `main`
   - **Folder**: `/web-app`
3. Click **Save**

Your tracker will be live at:
```
https://singh-vikas.github.io/Daily-Longevity-Tracker/
```

---

**Repository URL**: https://github.com/singh-vikas/Daily-Longevity-Tracker


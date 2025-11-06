#!/bin/bash

# Setup and Push Daily Longevity Tracker to GitHub

set -e

REPO_DIR="/Users/vikaskumar.singh/opensource/System-Design/Daily-Longevity-Tracker"
SOURCE_DIR="/Users/vikaskumar.singh/opensource/System-Design/Obsidian-Vault/Health/Longevity/Daily_Tracker_System"

echo "🚀 Setting up Daily Longevity Tracker repository..."

# Navigate to repository directory
cd "$REPO_DIR"

# Initialize git if not already initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing git repository..."
    git init
fi

# Copy files from source if repository is empty
if [ ! -f "README.md" ] || [ -z "$(ls -A $REPO_DIR)" ]; then
    echo "📋 Copying files from source..."
    cp -r "$SOURCE_DIR"/* "$REPO_DIR"/
    cp -r "$SOURCE_DIR"/.gitignore "$REPO_DIR"/ 2>/dev/null || true
fi

# Add remote
echo "🔗 Setting up remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/singh-vikas/Daily-Longevity-Tracker.git

# Add all files
echo "➕ Adding files..."
git add -A

# Commit
echo "💾 Committing changes..."
git commit -m "Initial commit: Daily Longevity Tracker

- Complete tracker system with markdown and web app
- Productivity scoring and report generation
- Science-based protocols from longevity research
- Ready for GitHub Pages deployment
- Markdown tracker for command-line usage
- Web app for online tracking
- Comprehensive documentation
- MIT License
- GitHub Actions workflow for auto-deployment" || echo "Nothing to commit"

# Set branch to main
git branch -M main

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main --force

echo "✅ Successfully pushed to GitHub!"
echo "🌐 Repository: https://github.com/singh-vikas/Daily-Longevity-Tracker"
echo ""
echo "📝 Next steps:"
echo "1. Enable GitHub Pages: https://github.com/singh-vikas/Daily-Longevity-Tracker/settings/pages"
echo "2. Set source to: Branch 'main', Folder '/web-app'"
echo "3. Your tracker will be live at: https://singh-vikas.github.io/Daily-Longevity-Tracker/"


#!/bin/bash

# Quick Push Script for Daily Longevity Tracker
cd "$(dirname "$0")"

echo "🚀 Pushing Daily Longevity Tracker to GitHub..."

# Initialize git if needed
if [ ! -d ".git" ]; then
    echo "📦 Initializing git..."
    git init
fi

# Ensure we have all files from source
if [ ! -d "markdown-tracker" ] || [ ! -d "web-app" ]; then
    echo "📋 Copying files from source..."
    SOURCE="/Users/vikaskumar.singh/opensource/System-Design/Obsidian-Vault/Health/Longevity/Daily_Tracker_System"
    cp -r "$SOURCE"/* . 2>/dev/null || true
    cp -r "$SOURCE"/.gitignore . 2>/dev/null || true
fi

# Set remote
git remote remove origin 2>/dev/null
git remote add origin https://github.com/singh-vikas/Daily-Longevity-Tracker.git

# Add and commit
git add -A
git commit -m "Initial commit: Daily Longevity Tracker" || echo "Nothing new to commit"

# Set branch
git branch -M main

# Push
echo "⬆️  Pushing to GitHub..."
git push -u origin main --force

echo "✅ Done! Check: https://github.com/singh-vikas/Daily-Longevity-Tracker"


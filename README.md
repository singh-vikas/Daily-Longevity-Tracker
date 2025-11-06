# 🌱 Daily Longevity Tracker

A comprehensive daily tracking and productivity reporting system for optimizing longevity and health based on science-backed protocols.

## ✨ Features

- **📝 Markdown Tracker**: Command-line tool for daily tracking with markdown files
- **🌐 Web App**: Online tracker with real-time reports and data visualization
- **📊 Productivity Scoring**: Automatic calculation of productivity score (0-100)
- **💡 Insights & Recommendations**: Personalized feedback based on your data

## 🚀 Quick Start

### Option 1: Web-Based Tracker (Recommended)

1. **Deploy to GitHub Pages** (see [DEPLOYMENT.md](DEPLOYMENT.md))
2. **Access online** at your GitHub Pages URL
3. **Fill tracker** directly in browser
4. **Generate reports** instantly

### Option 2: Command-Line Tracker

1. **Copy template**: `cp markdown-tracker/Daily_Tracker_Template.md Daily_Tracker_2024-01-15.md`
2. **Fill tracker** in your editor
3. **Generate report**: `python markdown-tracker/productivity_report_generator.py --input Daily_Tracker_2024-01-15.md --output report.html`

## 📂 Structure

```
Daily-Longevity-Tracker/
├── README.md              # This file
├── DEPLOYMENT.md          # Deployment guide
├── USAGE.md               # How to use the tracker
├── DESIGN.md              # Code design documentation
├── LICENSE                # MIT License
│
├── docs/                  # Web app (GitHub Pages)
│   ├── index.html
│   ├── styles.css
│   ├── tracker.js
│   └── report-generator.js
│
├── markdown-tracker/      # Command-line tools
│   ├── Daily_Tracker_Template.md
│   └── productivity_report_generator.py
│
└── web-app/               # Original web app source
    └── ...
```

## 📊 What Gets Tracked

- Sleep quality and duration
- Energy levels (morning, afternoon, evening)
- Exercise (strength, cardio, flexibility)
- Nutrition (protein, carbs, fats, fiber)
- Habits completed
- Mood and stress levels

## 📈 Productivity Score

Automatically calculated (0-100) based on:
- Sleep Quality (25 points)
- Energy Levels (25 points)
- Exercise Completion (20 points)
- Habit Consistency (20 points)
- Nutrition Completion (10 points)

## 🔬 Science-Based

Based on protocols from:
- **Andrew Huberman** - Circadian rhythm optimization
- **Peter Attia** - Zone 2 training, longevity protocols
- **Mark Hyman** - Functional medicine, metabolic health
- **Bryan Johnson** - Blueprint protocol, biomarker optimization

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Repository**: https://github.com/YOUR_USERNAME/Daily-Longevity-Tracker

# Daily Tracker & Productivity Report System

## 📂 Folder Structure

This folder contains all files related to daily tracking and productivity reporting.

```
Daily_Tracker_System/
├── README.md                          # This file - overview
│
├── markdown-tracker/                  # 📝 Markdown/command-line tracker
│   ├── Daily_Tracker_Template.md     # Daily tracking template
│   ├── productivity_report_generator.py  # Python script for reports
│   ├── QUICK_START.md                 # Quick start guide
│   └── README_Tracker.md              # Complete documentation
│
└── web-app/                           # 🌐 Web-based tracker application
    ├── index.html                     # Main web application
    ├── styles.css                     # Styling
    ├── tracker.js                     # Data management
    ├── report-generator.js            # Report generation
    ├── .nojekyll                      # GitHub Pages config
    ├── README_WEB.md                  # Web app documentation
    ├── QUICK_DEPLOY.md                # Quick deploy guide
    └── DEPLOYMENT.md                  # Full deployment guide
```

## 🚀 Quick Start

### Option 1: Web-Based Tracker (Recommended)

1. **Deploy to GitHub Pages** (see `web-app/QUICK_DEPLOY.md`)
2. **Access online** at your GitHub Pages URL
3. **Fill tracker** directly in browser
4. **Generate reports** instantly

### Option 2: Command-Line Tracker

1. **Copy template**: `cp markdown-tracker/Daily_Tracker_Template.md Daily_Tracker_2024-01-15.md`
2. **Fill tracker** in your editor
3. **Generate report**: `python markdown-tracker/productivity_report_generator.py --input Daily_Tracker_2024-01-15.md --output report.html`

## 📊 What This System Does

- **Daily Tracking**: Track sleep, energy, exercise, nutrition, habits
- **Productivity Scoring**: Automatic calculation of productivity score (0-100)
- **Report Generation**: Create markdown, HTML, or JSON reports
- **Insights & Recommendations**: Get personalized feedback based on your data

## 📖 Documentation

### For Command-Line Usage:
- **markdown-tracker/QUICK_START.md** - 3-step quick start guide
- **markdown-tracker/README_Tracker.md** - Complete documentation with all features
- **markdown-tracker/Daily_Tracker_Template.md** - Template with all metrics to track

### For Web Application:
- **web-app/README_WEB.md** - Web app usage guide
- **web-app/QUICK_DEPLOY.md** - Quick deployment guide
- **web-app/DEPLOYMENT.md** - Full deployment instructions

## 🔗 Related Files

- **Main Routine**: `../0.Daily_Block_Routine.md` - Science-based daily routine
- **Other Longevity Files**: `../` - Additional longevity resources

## 🎯 Which Option to Choose?

### Choose Web App if:
- ✅ You want to track online
- ✅ You want instant reports
- ✅ You want to access from any device
- ✅ You prefer a visual interface

### Choose Command-Line if:
- ✅ You prefer markdown files
- ✅ You use Obsidian or similar tools
- ✅ You want version control with Git
- ✅ You prefer local files

**Note**: You can use both! Track in web app, export data, and use Python script for analysis.

---

**Start tracking today to optimize your longevity routine!**

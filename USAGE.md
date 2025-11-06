# 📖 How to Use Daily Longevity Tracker

## Web App (Recommended)

### Daily Tracking

1. **Open the tracker** at your GitHub Pages URL
2. **Select today's date** (default)
3. **Fill in the form** throughout the day:
   - Morning: Sleep, energy, exercise
   - Afternoon: Meals, habits
   - Evening: Mood, notes
4. **Click "Save Tracker"** to save data

### Generate Reports

1. Go to **Reports** tab
2. Select date
3. Click **Generate Report**
4. View productivity score and insights
5. **Export** if needed (downloads HTML)

### View History

1. Go to **History** tab
2. See all tracked dates
3. Click any date to load and edit
4. View productivity scores

## Manual Tracker (Markdown Files)

### Step 1: Create Daily Tracker

```bash
cd markdown-tracker
cp Daily_Tracker_Template.md Daily_Tracker_2024-01-15.md
```

### Step 2: Fill Tracker Manually

Open the markdown file in your editor (Obsidian, VS Code, etc.) and fill in:
- Sleep metrics (fill in the blanks)
- Energy levels (enter numbers)
- Exercise completed (check boxes)
- Nutrition data (fill in grams)
- Habits checked off (mark checkboxes)
- Mood and notes (write text)

**This is manual entry** - you type/edit the markdown file directly.

### Step 3: Generate Report

```bash
python productivity_report_generator.py \
  --input Daily_Tracker_2024-01-15.md \
  --output report_2024-01-15.html
```

The Python script reads your manually-filled markdown file and generates a report.

## Productivity Score

- **80-100**: 🟢 Excellent - Maintain and optimize
- **60-79**: 🟡 Good - Room for improvement  
- **0-59**: 🔴 Needs Improvement - Focus on core habits

## Data Storage

### Web App
- Data stored in browser localStorage
- Private to your browser
- No backend required

### Manual Tracker
- Markdown files in your local directory
- You manually edit the files
- Full version control with Git
- Export reports as HTML/JSON

## Tips

1. **Fill Throughout Day**: Don't wait until evening
2. **Be Consistent**: Track daily, even if incomplete
3. **Review Reports**: Use insights to improve
4. **Export Regularly**: Backup your data

---

See [DESIGN.md](DESIGN.md) for technical details.


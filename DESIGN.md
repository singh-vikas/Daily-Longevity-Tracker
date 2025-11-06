# 🏗️ Code Design Documentation

## Architecture Overview

The Daily Longevity Tracker consists of two main components:

1. **Web Application** - Client-side single-page application (online form interface)
2. **Manual Tracker** - Markdown-based tracking with Python report generator

## Web Application (`docs/` or `web-app/`)

### Technology Stack
- **HTML5** - Structure
- **CSS3** - Styling (custom CSS with CSS variables)
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **localStorage API** - Client-side data persistence

### File Structure

```
docs/
├── index.html              # Main application entry point
├── styles.css              # All styling and responsive design
├── tracker.js              # Data management and localStorage
└── report-generator.js     # Productivity scoring and report generation
```

### Key Components

#### `tracker.js`
- **Data Management**: Handles saving/loading tracker data
- **localStorage**: Uses browser localStorage for persistence
- **Tab Switching**: Manages UI tabs (tracker/report/history)
- **Date Management**: Handles date selection and formatting

**Key Functions:**
- `saveTrackerData()` - Saves form data to localStorage
- `loadTrackerData()` - Loads data for selected date
- `loadHistory()` - Displays all tracked dates
- `getStoredData()` - Retrieves all stored data

#### `report-generator.js`
- **Productivity Scoring**: Calculates 0-100 score
- **Insights Generation**: Creates personalized recommendations
- **Report Rendering**: Generates HTML reports

**Key Functions:**
- `calculateProductivityScore()` - Computes overall score
- `generateInsights()` - Creates insights based on data
- `generateReport()` - Renders complete report
- `exportReport()` - Downloads report as HTML

#### `styles.css`
- **CSS Variables**: Theme colors and spacing
- **Responsive Design**: Mobile-first approach
- **Component Styling**: Cards, forms, tabs, metrics

### Data Model

```javascript
{
  "2024-01-15": {
    date: "2024-01-15",
    bedtime: "22:30",
    wakeTime: "05:45",
    sleepDuration: 7.25,
    sleepQuality: 8,
    energyMorning: 8,
    energyAfternoon: 7,
    energyEvening: 6,
    exerciseStrength: true,
    exerciseCardio: true,
    exerciseStrengthDuration: 35,
    exerciseCardioDuration: 20,
    breakfast: { time: "08:30", protein: 35, carbs: 55, fats: 15 },
    lunch: { time: "12:30", protein: 40, carbs: 60, fats: 20 },
    dinner: { time: "18:00", protein: 30, carbs: 40, fats: 15 },
    habitMorningSunlight: true,
    habitMeditation: true,
    habitSupplements: true,
    habitDigitalSunset: true,
    habitSocial: true,
    habitNature: false,
    mood: 8,
    stress: 3,
    notes: "Great day!"
  }
}
```

### Productivity Score Algorithm

```javascript
Score = 
  (sleepQuality / 10 * 25) +           // 25 points
  (avgEnergy / 10 * 25) +              // 25 points
  (exerciseCompleted ? 20 : 0) +       // 20 points
  (habitsCompleted / totalHabits * 20) + // 20 points
  (mealsCompleted / 3 * 10)            // 10 points
```

## Manual Tracker (`markdown-tracker/`)

### What It Is
A **manual tracking system** where you:
1. Copy a markdown template file
2. Fill it out manually in any text editor (Obsidian, VS Code, etc.)
3. Run a Python script to generate productivity reports

### Technology Stack
- **Python 3.7+** - Language
- **Standard Library** - No external dependencies
- **Markdown Parsing** - Regex-based parsing
- **Report Generation** - HTML/JSON/Markdown output

### File Structure

```
markdown-tracker/
├── Daily_Tracker_Template.md           # Template for daily tracking
└── productivity_report_generator.py  # Report generator script
```

### Key Components

#### `productivity_report_generator.py`

**Classes:**
- `TrackerParser` - Parses markdown tracker files
- `ProductivityReportGenerator` - Generates reports

**Key Methods:**
- `parse_sleep_metrics()` - Extracts sleep data
- `parse_energy_levels()` - Extracts energy data
- `parse_exercise()` - Extracts exercise data
- `parse_nutrition()` - Extracts nutrition data
- `calculate_productivity_score()` - Computes score
- `generate_insights()` - Creates recommendations
- `generate_markdown_report()` - Creates markdown report
- `generate_html_report()` - Creates HTML report
- `generate_json_report()` - Creates JSON report

**Usage:**
```bash
python productivity_report_generator.py \
  --input Daily_Tracker_2024-01-15.md \
  --output report_2024-01-15.html \
  --format html
```

## Design Principles

### 1. Client-Side First
- Web app works entirely in browser
- No backend required
- Data privacy (localStorage)

### 2. Progressive Enhancement
- Works without JavaScript (basic form)
- Enhanced with JavaScript (full features)
- Graceful degradation

### 3. Mobile-First
- Responsive design
- Touch-friendly interface
- Works on all devices

### 4. Data Portability
- Export/import functionality
- Multiple formats (HTML/JSON/Markdown)
- Easy migration

### 5. Science-Based
- Protocols from longevity research
- Evidence-backed metrics
- Actionable insights

## Performance Considerations

### Web App
- **LocalStorage**: Fast read/write operations
- **No Network Calls**: Instant loading
- **Minimal Dependencies**: Pure JavaScript
- **Lazy Loading**: Reports generated on-demand

### Command-Line
- **Streaming**: Processes files line-by-line
- **Regex Parsing**: Fast pattern matching
- **Single Pass**: One-time file read

## Security & Privacy

### Web App
- **Client-Side Only**: No data sent to servers
- **localStorage**: Browser-level privacy
- **HTTPS**: Secure connection (GitHub Pages)
- **No Tracking**: No analytics or tracking scripts

### Command-Line
- **Local Files**: All data stays local
- **No External Calls**: No network requests
- **User Control**: Full control over data

## Future Enhancements

### Potential Additions
- Cloud sync (optional Firebase/Backend)
- Data visualization charts
- Export to CSV/Excel
- PWA support (offline mode)
- Integration with fitness trackers
- Weekly/monthly summaries
- Email reports

### Technical Debt
- Consider framework for larger scale (React/Vue)
- Add unit tests
- Improve error handling
- Add data validation
- Implement data backup/restore

---

**Last Updated**: 2024
**Version**: 1.0


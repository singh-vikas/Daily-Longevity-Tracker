#!/usr/bin/env python3
"""
Daily Tracker Data Processor and Productivity Report Generator

This script processes daily tracker data and generates productivity reports
based on the Daily Block Routine.

Usage:
    python productivity_report_generator.py --input daily_tracker.md --output report.html
    python productivity_report_generator.py --input daily_tracker.md --output report.md
    python productivity_report_generator.py --input daily_tracker.md --output report.json
"""

import re
import json
import argparse
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Any
from collections import defaultdict


class TrackerParser:
    """Parse daily tracker markdown files"""
    
    def __init__(self, file_path: str):
        self.file_path = Path(file_path)
        self.content = self.file_path.read_text() if self.file_path.exists() else ""
    
    def parse_date(self) -> str:
        """Extract date from tracker"""
        match = re.search(r'# Daily Tracker - (.+)', self.content)
        return match.group(1) if match else datetime.now().strftime('%Y-%m-%d')
    
    def parse_sleep_metrics(self) -> Dict[str, Any]:
        """Extract sleep metrics"""
        metrics = {}
        
        # Bedtime
        bedtime_match = re.search(r'\*\*Bedtime\*\*:\s*(.+)', self.content)
        metrics['bedtime'] = bedtime_match.group(1).strip() if bedtime_match else None
        
        # Wake time
        wake_match = re.search(r'\*\*Wake Time\*\*:\s*(.+)', self.content)
        metrics['wake_time'] = wake_match.group(1).strip() if wake_match else None
        
        # Sleep duration
        duration_match = re.search(r'\*\*Sleep Duration\*\*:\s*(\d+(?:\.\d+)?)\s*hours', self.content)
        metrics['duration'] = float(duration_match.group(1)) if duration_match else None
        
        # Sleep quality
        quality_match = re.search(r'\*\*Sleep Quality\*\*\s*\(1-10\):\s*(\d+)', self.content)
        metrics['quality'] = int(quality_match.group(1)) if quality_match else None
        
        return metrics
    
    def parse_energy_levels(self) -> Dict[str, int]:
        """Extract energy levels"""
        energy = {}
        
        morning_match = re.search(r'\*\*Morning\*\*\s*\(1-10\):\s*(\d+)', self.content)
        afternoon_match = re.search(r'\*\*Afternoon\*\*\s*\(1-10\):\s*(\d+)', self.content)
        evening_match = re.search(r'\*\*Evening\*\*\s*\(1-10\):\s*(\d+)', self.content)
        avg_match = re.search(r'\*\*Average\*\*:\s*(\d+(?:\.\d+)?)', self.content)
        
        energy['morning'] = int(morning_match.group(1)) if morning_match else None
        energy['afternoon'] = int(afternoon_match.group(1)) if afternoon_match else None
        energy['evening'] = int(evening_match.group(1)) if evening_match else None
        energy['average'] = float(avg_match.group(1)) if avg_match else None
        
        return energy
    
    def parse_exercise(self) -> Dict[str, Any]:
        """Extract exercise data"""
        exercise = {
            'strength_training': False,
            'cardio': False,
            'flexibility': False,
            'cold_exposure': False,
            'total_minutes': 0
        }
        
        # Check checkboxes
        if re.search(r'- \[x\] Strength training', self.content, re.IGNORECASE):
            exercise['strength_training'] = True
            duration_match = re.search(r'Duration:\s*(\d+)\s*minutes', self.content)
            if duration_match:
                exercise['strength_duration'] = int(duration_match.group(1))
                exercise['total_minutes'] += int(duration_match.group(1))
        
        if re.search(r'- \[x\] Cardio', self.content, re.IGNORECASE):
            exercise['cardio'] = True
            duration_match = re.search(r'Cardio.*Duration:\s*(\d+)\s*minutes', self.content)
            if duration_match:
                exercise['cardio_duration'] = int(duration_match.group(1))
                exercise['total_minutes'] += int(duration_match.group(1))
        
        if re.search(r'- \[x\] Flexibility', self.content, re.IGNORECASE):
            exercise['flexibility'] = True
        
        if re.search(r'- \[x\] Cold exposure', self.content, re.IGNORECASE):
            exercise['cold_exposure'] = True
        
        return exercise
    
    def parse_nutrition(self) -> Dict[str, Any]:
        """Extract nutrition data"""
        nutrition = {
            'breakfast': {},
            'lunch': {},
            'dinner': {},
            'total': {}
        }
        
        # Breakfast
        breakfast_protein = re.search(r'Breakfast.*Protein.*:\s*(\d+)', self.content, re.DOTALL)
        breakfast_carbs = re.search(r'Breakfast.*Carbs.*:\s*(\d+)', self.content, re.DOTALL)
        breakfast_fats = re.search(r'Breakfast.*Fats.*:\s*(\d+)', self.content, re.DOTALL)
        
        if breakfast_protein:
            nutrition['breakfast']['protein'] = int(breakfast_protein.group(1))
        if breakfast_carbs:
            nutrition['breakfast']['carbs'] = int(breakfast_carbs.group(1))
        if breakfast_fats:
            nutrition['breakfast']['fats'] = int(breakfast_fats.group(1))
        
        # Similar for lunch and dinner...
        # For brevity, showing pattern
        
        # Total calories
        total_cal_match = re.search(r'\*\*Total Calories\*\*:\s*(\d+)', self.content)
        if total_cal_match:
            nutrition['total']['calories'] = int(total_cal_match.group(1))
        
        return nutrition
    
    def parse_habits(self) -> Dict[str, bool]:
        """Extract habit completion"""
        habits = {}
        
        habit_patterns = {
            'morning_sunlight': r'- \[x\].*Morning sunlight',
            'meditation': r'- \[x\].*Meditation',
            'exercise': r'- \[x\].*Exercise.*Yes',
            'cold_exposure': r'- \[x\].*Cold exposure',
            'digital_sunset': r'- \[x\].*Digital sunset',
            'supplements': r'- \[x\].*Vitamin D3',
        }
        
        for habit, pattern in habit_patterns.items():
            habits[habit] = bool(re.search(pattern, self.content, re.IGNORECASE))
        
        return habits
    
    def parse_all(self) -> Dict[str, Any]:
        """Parse all tracker data"""
        return {
            'date': self.parse_date(),
            'sleep': self.parse_sleep_metrics(),
            'energy': self.parse_energy_levels(),
            'exercise': self.parse_exercise(),
            'nutrition': self.parse_nutrition(),
            'habits': self.parse_habits()
        }


class ProductivityReportGenerator:
    """Generate productivity reports from tracker data"""
    
    def __init__(self, data: Dict[str, Any]):
        self.data = data
        self.date = datetime.strptime(data['date'], '%Y-%m-%d') if 'date' in data else datetime.now()
    
    def calculate_productivity_score(self) -> float:
        """Calculate overall productivity score (0-100)"""
        score = 0
        max_score = 100
        
        # Sleep quality (25 points)
        if self.data.get('sleep', {}).get('quality'):
            score += (self.data['sleep']['quality'] / 10) * 25
        
        # Energy levels (25 points)
        if self.data.get('energy', {}).get('average'):
            score += (self.data['energy']['average'] / 10) * 25
        
        # Exercise completion (20 points)
        exercise = self.data.get('exercise', {})
        if exercise.get('strength_training') or exercise.get('cardio'):
            score += 20
        
        # Habit completion (20 points)
        habits = self.data.get('habits', {})
        completed = sum(1 for v in habits.values() if v)
        total = len(habits)
        if total > 0:
            score += (completed / total) * 20
        
        # Nutrition completion (10 points)
        nutrition = self.data.get('nutrition', {})
        meals_completed = sum(1 for meal in ['breakfast', 'lunch', 'dinner'] 
                             if nutrition.get(meal, {}))
        score += (meals_completed / 3) * 10
        
        return min(score, max_score)
    
    def generate_insights(self) -> List[str]:
        """Generate insights from the data"""
        insights = []
        
        sleep = self.data.get('sleep', {})
        energy = self.data.get('energy', {})
        exercise = self.data.get('exercise', {})
        
        # Sleep insights
        if sleep.get('duration'):
            if sleep['duration'] < 7:
                insights.append("⚠️ Sleep duration below optimal (aim for 7-9 hours)")
            elif sleep['duration'] >= 7:
                insights.append("✅ Good sleep duration")
        
        if sleep.get('quality'):
            if sleep['quality'] < 7:
                insights.append("⚠️ Sleep quality could be improved")
            else:
                insights.append("✅ Excellent sleep quality")
        
        # Energy insights
        if energy.get('morning') and energy.get('evening'):
            if energy['morning'] > energy['evening']:
                insights.append("📈 Energy follows healthy circadian pattern")
            else:
                insights.append("⚠️ Energy declining throughout day - consider optimization")
        
        # Exercise insights
        if exercise.get('total_minutes'):
            if exercise['total_minutes'] >= 45:
                insights.append("✅ Excellent exercise volume")
            elif exercise['total_minutes'] >= 30:
                insights.append("✅ Good exercise volume")
            else:
                insights.append("⚠️ Consider increasing exercise duration")
        
        # Habit insights
        habits = self.data.get('habits', {})
        completed = sum(1 for v in habits.values() if v)
        total = len(habits)
        if total > 0:
            completion_rate = (completed / total) * 100
            if completion_rate >= 80:
                insights.append("✅ Excellent habit consistency")
            elif completion_rate >= 60:
                insights.append("⚠️ Good habit consistency - room for improvement")
            else:
                insights.append("⚠️ Low habit consistency - focus on building routines")
        
        return insights
    
    def generate_markdown_report(self) -> str:
        """Generate markdown report"""
        score = self.calculate_productivity_score()
        insights = self.generate_insights()
        
        report = f"""# Productivity Report - {self.data.get('date', 'Unknown Date')}

## 📊 Overall Productivity Score

**Score: {score:.1f}/100**

{'🟢 Excellent' if score >= 80 else '🟡 Good' if score >= 60 else '🔴 Needs Improvement'}

---

## 📈 Daily Metrics

### Sleep Quality
- **Duration**: {self.data.get('sleep', {}).get('duration', 'N/A')} hours
- **Quality**: {self.data.get('sleep', {}).get('quality', 'N/A')}/10
- **Bedtime**: {self.data.get('sleep', {}).get('bedtime', 'N/A')}
- **Wake Time**: {self.data.get('sleep', {}).get('wake_time', 'N/A')}

### Energy Levels
- **Morning**: {self.data.get('energy', {}).get('morning', 'N/A')}/10
- **Afternoon**: {self.data.get('energy', {}).get('afternoon', 'N/A')}/10
- **Evening**: {self.data.get('energy', {}).get('evening', 'N/A')}/10
- **Average**: {self.data.get('energy', {}).get('average', 'N/A')}/10

### Exercise
- **Total Minutes**: {self.data.get('exercise', {}).get('total_minutes', 0)} minutes
- **Strength Training**: {'✅' if self.data.get('exercise', {}).get('strength_training') else '❌'}
- **Cardio**: {'✅' if self.data.get('exercise', {}).get('cardio') else '❌'}
- **Flexibility**: {'✅' if self.data.get('exercise', {}).get('flexibility') else '❌'}

### Habits Completed
"""
        
        habits = self.data.get('habits', {})
        for habit, completed in habits.items():
            status = '✅' if completed else '❌'
            habit_name = habit.replace('_', ' ').title()
            report += f"- {status} {habit_name}\n"
        
        report += f"""
---

## 💡 Insights & Recommendations

"""
        
        for insight in insights:
            report += f"- {insight}\n"
        
        report += f"""
---

## 🎯 Recommendations

"""
        
        # Generate recommendations based on score
        if score < 60:
            report += """
- **Priority**: Focus on building consistent morning and evening routines
- **Action**: Start with 3 core habits and build from there
- **Sleep**: Prioritize sleep quality and duration
"""
        elif score < 80:
            report += """
- **Good progress**: Continue building on current habits
- **Focus**: Optimize areas scoring below 7/10
- **Consistency**: Maintain current routine and add 1-2 new habits
"""
        else:
            report += """
- **Excellent**: Maintain current routine
- **Optimization**: Fine-tune for peak performance
- **Long-term**: Consider adding advanced protocols
"""
        
        report += f"""
---

## 📅 Next Steps

1. Review insights and recommendations
2. Adjust routine based on low-performing areas
3. Set 3 specific goals for tomorrow
4. Track progress over time

---

*Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*
"""
        
        return report
    
    def generate_html_report(self) -> str:
        """Generate HTML report"""
        score = self.calculate_productivity_score()
        insights = self.generate_insights()
        
        color = '#28a745' if score >= 80 else '#ffc107' if score >= 60 else '#dc3545'
        
        html = f"""<!DOCTYPE html>
<html>
<head>
    <title>Productivity Report - {self.data.get('date', 'Unknown')}</title>
    <style>
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }}
        .container {{
            background: white;
            border-radius: 10px;
            padding: 30px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }}
        h1 {{
            color: #333;
            border-bottom: 3px solid {color};
            padding-bottom: 10px;
        }}
        .score {{
            font-size: 48px;
            font-weight: bold;
            color: {color};
            text-align: center;
            margin: 20px 0;
        }}
        .metric {{
            background: #f8f9fa;
            padding: 15px;
            margin: 10px 0;
            border-radius: 5px;
            border-left: 4px solid {color};
        }}
        .insight {{
            padding: 10px;
            margin: 5px 0;
            background: #e7f3ff;
            border-left: 4px solid #2196F3;
            border-radius: 3px;
        }}
        .check {{
            color: #28a745;
            font-weight: bold;
        }}
        .cross {{
            color: #dc3545;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 Productivity Report</h1>
        <p style="text-align: center; color: #666;">{self.data.get('date', 'Unknown Date')}</p>
        
        <div class="score">{score:.1f}/100</div>
        
        <h2>📈 Daily Metrics</h2>
        
        <div class="metric">
            <h3>Sleep Quality</h3>
            <p>Duration: {self.data.get('sleep', {}).get('duration', 'N/A')} hours</p>
            <p>Quality: {self.data.get('sleep', {}).get('quality', 'N/A')}/10</p>
        </div>
        
        <div class="metric">
            <h3>Energy Levels</h3>
            <p>Morning: {self.data.get('energy', {}).get('morning', 'N/A')}/10</p>
            <p>Afternoon: {self.data.get('energy', {}).get('afternoon', 'N/A')}/10</p>
            <p>Evening: {self.data.get('energy', {}).get('evening', 'N/A')}/10</p>
            <p>Average: {self.data.get('energy', {}).get('average', 'N/A')}/10</p>
        </div>
        
        <div class="metric">
            <h3>Exercise</h3>
            <p>Total Minutes: {self.data.get('exercise', {}).get('total_minutes', 0)} minutes</p>
            <p>Strength Training: {'<span class="check">✅</span>' if self.data.get('exercise', {}).get('strength_training') else '<span class="cross">❌</span>'}</p>
            <p>Cardio: {'<span class="check">✅</span>' if self.data.get('exercise', {}).get('cardio') else '<span class="cross">❌</span>'}</p>
        </div>
        
        <h2>💡 Insights & Recommendations</h2>
"""
        
        for insight in insights:
            html += f'        <div class="insight">{insight}</div>\n'
        
        html += f"""
        <h2>🎯 Next Steps</h2>
        <ol>
            <li>Review insights and recommendations</li>
            <li>Adjust routine based on low-performing areas</li>
            <li>Set 3 specific goals for tomorrow</li>
            <li>Track progress over time</li>
        </ol>
        
        <p style="text-align: center; color: #999; margin-top: 30px;">
            Generated on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
        </p>
    </div>
</body>
</html>
"""
        
        return html
    
    def generate_json_report(self) -> str:
        """Generate JSON report"""
        report = {
            'date': self.data.get('date'),
            'productivity_score': self.calculate_productivity_score(),
            'metrics': {
                'sleep': self.data.get('sleep', {}),
                'energy': self.data.get('energy', {}),
                'exercise': self.data.get('exercise', {}),
                'habits': self.data.get('habits', {}),
                'nutrition': self.data.get('nutrition', {})
            },
            'insights': self.generate_insights(),
            'generated_at': datetime.now().isoformat()
        }
        
        return json.dumps(report, indent=2)


def main():
    parser = argparse.ArgumentParser(description='Generate productivity reports from daily tracker')
    parser.add_argument('--input', '-i', required=True, help='Input daily tracker markdown file')
    parser.add_argument('--output', '-o', required=True, help='Output report file (supports .md, .html, .json)')
    parser.add_argument('--format', '-f', choices=['md', 'html', 'json'], help='Output format (auto-detected from file extension if not specified)')
    
    args = parser.parse_args()
    
    # Parse tracker
    tracker = TrackerParser(args.input)
    data = tracker.parse_all()
    
    # Generate report
    generator = ProductivityReportGenerator(data)
    
    # Determine format
    output_path = Path(args.output)
    format_type = args.format or output_path.suffix[1:].lower()
    
    if format_type == 'html':
        report = generator.generate_html_report()
    elif format_type == 'json':
        report = generator.generate_json_report()
    else:
        report = generator.generate_markdown_report()
    
    # Write output
    output_path.write_text(report)
    print(f"✅ Report generated: {output_path}")
    print(f"📊 Productivity Score: {generator.calculate_productivity_score():.1f}/100")


if __name__ == '__main__':
    main()


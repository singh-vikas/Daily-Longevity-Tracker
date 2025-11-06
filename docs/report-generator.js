// Report Generator JavaScript
function generateReport() {
    const date = document.getElementById('report-date')?.value || document.getElementById('tracker-date')?.value;
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    const data = getStoredData();
    const dayData = data[date];
    
    if (!dayData) {
        alert('No data found for this date. Please fill the tracker first.');
        return;
    }
    
    const score = calculateProductivityScore(dayData);
    const insights = generateInsights(dayData);
    
    const reportContent = document.getElementById('report-content');
    reportContent.innerHTML = `
        <div class="score-card">
            <h2>${score.toFixed(1)}/100</h2>
            <p>Productivity Score</p>
            <p style="margin-top: 10px; font-size: 1rem;">
                ${score >= 80 ? '🟢 Excellent' : score >= 60 ? '🟡 Good' : '🔴 Needs Improvement'}
            </p>
        </div>
        
        <div class="metric-card">
            <h3>😴 Sleep Quality</h3>
            <p><strong>Duration:</strong> ${dayData.sleepDuration || 'N/A'} hours</p>
            <p><strong>Quality:</strong> ${dayData.sleepQuality || 'N/A'}/10</p>
            <p><strong>Bedtime:</strong> ${dayData.bedtime || 'N/A'}</p>
            <p><strong>Wake Time:</strong> ${dayData.wakeTime || 'N/A'}</p>
        </div>
        
        <div class="metric-card">
            <h3>⚡ Energy Levels</h3>
            <p><strong>Morning:</strong> ${dayData.energyMorning || 'N/A'}/10</p>
            <p><strong>Afternoon:</strong> ${dayData.energyAfternoon || 'N/A'}/10</p>
            <p><strong>Evening:</strong> ${dayData.energyEvening || 'N/A'}/10</p>
            <p><strong>Average:</strong> ${calculateAverageEnergy(dayData)}/10</p>
        </div>
        
        <div class="metric-card">
            <h3>🏋️ Exercise</h3>
            <p><strong>Strength Training:</strong> ${dayData.strengthTraining ? '✅' : '❌'} ${dayData.strengthDuration ? `(${dayData.strengthDuration} min)` : ''}</p>
            <p><strong>Cardio (Zone 2):</strong> ${dayData.zone2Training ? '✅' : '❌'} ${dayData.cardioDuration ? `(${dayData.cardioDuration} min)` : ''}</p>
            <p><strong>Cardio (Zone 5):</strong> ${dayData.zone5Training ? '✅' : '❌'}</p>
            <p><strong>Flexibility:</strong> ${dayData.flexibility ? '✅' : '❌'} ${dayData.flexibilityDuration ? `(${dayData.flexibilityDuration} min)` : ''}</p>
            <p><strong>Total Minutes:</strong> ${(dayData.strengthDuration || 0) + (dayData.cardioDuration || 0) + (dayData.flexibilityDuration || 0)} minutes</p>
        </div>
        
        <div class="metric-card">
            <h3>🍽️ Nutrition</h3>
            <p><strong>Breakfast:</strong> P: ${dayData.breakfastProtein || 0}g, C: ${dayData.breakfastCarbs || 0}g, F: ${dayData.breakfastFats || 0}g, Fiber: ${dayData.breakfastFiber || 0}g</p>
            <p><strong>Lunch:</strong> P: ${dayData.lunchProtein || 0}g, C: ${dayData.lunchCarbs || 0}g, F: ${dayData.lunchFats || 0}g, Fiber: ${dayData.lunchFiber || 0}g</p>
            <p><strong>Dinner:</strong> P: ${dayData.dinnerProtein || 0}g, C: ${dayData.dinnerCarbs || 0}g, F: ${dayData.dinnerFats || 0}g, Fiber: ${dayData.dinnerFiber || 0}g</p>
            <p><strong>Total Protein:</strong> ${(dayData.breakfastProtein || 0) + (dayData.lunchProtein || 0) + (dayData.dinnerProtein || 0)}g</p>
            <p><strong>Total Fiber:</strong> ${(dayData.breakfastFiber || 0) + (dayData.lunchFiber || 0) + (dayData.dinnerFiber || 0)}g</p>
        </div>
        
        <div class="metric-card">
            <h3>✅ Habits Completed</h3>
            <p>${dayData.morningSunlight ? '✅' : '❌'} Morning Sunlight</p>
            <p>${dayData.meditation ? '✅' : '❌'} Meditation</p>
            <p>${dayData.gratitude ? '✅' : '❌'} Gratitude Journaling</p>
            <p>${dayData.postBreakfastWalk ? '✅' : '❌'} Post-Breakfast Walk</p>
            <p>${dayData.postLunchWalk ? '✅' : '❌'} Post-Lunch Walk</p>
            <p>${dayData.nsdr ? '✅' : '❌'} NSDR (Non-Sleep Deep Rest)</p>
            <p>${dayData.digitalSunset ? '✅' : '❌'} Digital Sunset</p>
            <p>${dayData.eveningJournal ? '✅' : '❌'} Evening Journal</p>
            <p>${dayData.gratitudeReflection ? '✅' : '❌'} Gratitude Reflection</p>
        </div>
        
        <div class="metric-card">
            <h3>😊 Mood & Stress</h3>
            <p><strong>Mood:</strong> ${dayData.mood || 'N/A'}/10</p>
            <p><strong>Stress:</strong> ${dayData.stress || 'N/A'}/10</p>
        </div>
        
        <h2 style="margin-top: 30px; color: #2563eb;">💡 Insights & Recommendations</h2>
        ${insights.map(insight => `<div class="insight ${insight.type || ''}">${insight.text}</div>`).join('')}
        
        <h2 style="margin-top: 30px; color: #2563eb;">🎯 Recommendations</h2>
        ${getRecommendations(score)}
        
        ${dayData.notes ? `<div class="metric-card" style="margin-top: 20px;"><h3>📝 Notes</h3><p>${dayData.notes}</p></div>` : ''}
    `;
    
    // Switch to report tab
    showTab('report');
}

function calculateProductivityScore(dayData) {
    let score = 0;
    
    // Sleep quality (25 points)
    if (dayData.sleepQuality) {
        score += (dayData.sleepQuality / 10) * 25;
    }
    
    // Energy levels (25 points)
    const avgEnergy = calculateAverageEnergy(dayData);
    if (avgEnergy !== 'N/A') {
        score += (parseFloat(avgEnergy) / 10) * 25;
    }
    
    // Exercise completion (20 points)
    if (dayData.strengthTraining || dayData.zone2Training || dayData.zone5Training) {
        score += 20;
    } else if (dayData.flexibility) {
        score += 10;
    }
    
    // Habit completion (20 points) - Updated to match current tracker fields
    const habits = [
        dayData.morningSunlight,
        dayData.meditation,
        dayData.gratitude,
        dayData.postBreakfastWalk,
        dayData.postLunchWalk,
        dayData.nsdr,
        dayData.digitalSunset,
        dayData.eveningJournal
    ];
    const completedHabits = habits.filter(h => h).length;
    score += (completedHabits / habits.length) * 20;
    
    // Nutrition completion (10 points) - Updated to match current tracker fields
    const mealsCompleted = [
        dayData.breakfastCompleted,
        dayData.lunchCompleted,
        dayData.dinnerCompleted
    ].filter(Boolean).length;
    score += (mealsCompleted / 3) * 10;
    
    return Math.min(score, 100);
}

function generateInsights(dayData) {
    const insights = [];
    
    // Sleep insights
    if (dayData.sleepDuration) {
        if (dayData.sleepDuration < 7) {
            insights.push({ text: '⚠️ Sleep duration below optimal (aim for 7-9 hours)', type: 'warning' });
        } else {
            insights.push({ text: '✅ Good sleep duration', type: 'success' });
        }
    }
    
    if (dayData.sleepQuality) {
        if (dayData.sleepQuality < 7) {
            insights.push({ text: '⚠️ Sleep quality could be improved', type: 'warning' });
        } else {
            insights.push({ text: '✅ Excellent sleep quality', type: 'success' });
        }
    }
    
    // Energy insights
    if (dayData.energyMorning && dayData.energyEvening) {
        if (dayData.energyMorning > dayData.energyEvening) {
            insights.push({ text: '📈 Energy follows healthy circadian pattern', type: 'success' });
        } else {
            insights.push({ text: '⚠️ Energy declining throughout day - consider optimization', type: 'warning' });
        }
    }
    
    // Exercise insights
    const totalMinutes = (dayData.strengthDuration || 0) + (dayData.cardioDuration || 0) + (dayData.flexibilityDuration || 0);
    if (totalMinutes >= 45) {
        insights.push({ text: '✅ Excellent exercise volume', type: 'success' });
    } else if (totalMinutes >= 30) {
        insights.push({ text: '✅ Good exercise volume', type: 'success' });
    } else if (totalMinutes > 0) {
        insights.push({ text: '⚠️ Consider increasing exercise duration', type: 'warning' });
    }
    
    // Habit insights
    const habits = [
        dayData.morningSunlight,
        dayData.meditation,
        dayData.gratitude,
        dayData.postBreakfastWalk,
        dayData.postLunchWalk,
        dayData.nsdr,
        dayData.digitalSunset,
        dayData.eveningJournal
    ];
    const completed = habits.filter(h => h).length;
    const completionRate = (completed / habits.length) * 100;
    
    if (completionRate >= 80) {
        insights.push({ text: '✅ Excellent habit consistency', type: 'success' });
    } else if (completionRate >= 60) {
        insights.push({ text: '⚠️ Good habit consistency - room for improvement', type: 'warning' });
    } else {
        insights.push({ text: '⚠️ Low habit consistency - focus on building routines', type: 'warning' });
    }
    
    return insights;
}

function getRecommendations(score) {
    if (score < 60) {
        return `
            <div class="insight warning">
                <strong>Priority:</strong> Focus on building consistent morning and evening routines<br>
                <strong>Action:</strong> Start with 3 core habits and build from there<br>
                <strong>Sleep:</strong> Prioritize sleep quality and duration
            </div>
        `;
    } else if (score < 80) {
        return `
            <div class="insight">
                <strong>Good progress:</strong> Continue building on current habits<br>
                <strong>Focus:</strong> Optimize areas scoring below 7/10<br>
                <strong>Consistency:</strong> Maintain current routine and add 1-2 new habits
            </div>
        `;
    } else {
        return `
            <div class="insight success">
                <strong>Excellent:</strong> Maintain current routine<br>
                <strong>Optimization:</strong> Fine-tune for peak performance<br>
                <strong>Long-term:</strong> Consider adding advanced protocols
            </div>
        `;
    }
}

function exportReport() {
    const date = document.getElementById('report-date')?.value || document.getElementById('tracker-date')?.value;
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    const reportContent = document.getElementById('report-content').innerHTML;
    const html = `
<!DOCTYPE html>
<html>
<head>
    <title>Productivity Report - ${date}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
        .score-card { text-align: center; padding: 30px; background: linear-gradient(135deg, #2563eb, #10b981); color: white; border-radius: 10px; margin-bottom: 30px; }
        .metric-card { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #2563eb; }
        .insight { padding: 15px; margin: 10px 0; background: #e0f2fe; border-left: 4px solid #0ea5e9; border-radius: 6px; }
    </style>
</head>
<body>
    <h1>Productivity Report - ${formatDate(date)}</h1>
    ${reportContent}
    <p style="text-align: center; color: #666; margin-top: 30px;">Generated on ${new Date().toLocaleString()}</p>
</body>
</html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `productivity_report_${date}.html`;
    a.click();
    URL.revokeObjectURL(url);
}


// Daily Tracker JavaScript
const STORAGE_KEY = 'longevity_tracker_data';
const STREAK_KEY = 'longevity_streak';

// Get all task checkboxes
function getAllTaskCheckboxes() {
    return document.querySelectorAll('input[type="checkbox"][onchange*="updateCompletion"]');
}

// Calculate completion percentage
function calculateCompletion() {
    const checkboxes = getAllTaskCheckboxes();
    if (checkboxes.length === 0) return 0;
    
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    return Math.round((checked / checkboxes.length) * 100);
}

// Update completion stats
function updateCompletion() {
    const percentage = calculateCompletion();
    const completionEl = document.getElementById('completion-percentage');
    if (completionEl) {
        completionEl.textContent = percentage + '%';
        
        // Visual feedback
        if (percentage === 100) {
            showReward('🎉 Perfect Day! You completed everything!');
        } else if (percentage >= 80) {
            showReward('🌟 Excellent progress!');
        } else if (percentage >= 60) {
            showReward('👍 Good job! Keep going!');
        }
    }
    
    // Update streak
    updateStreak();
    
    // Auto-save on checkbox change
    autoSave();
}

// Update streak counter
function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const data = getStoredData();
    const dayData = data[today];
    
    if (!dayData) return;
    
    const percentage = calculateCompletion();
    const streakData = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"current": 0, "lastDate": ""}');
    
    if (percentage >= 80 && streakData.lastDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        
        if (streakData.lastDate === yesterdayStr) {
            streakData.current += 1;
        } else if (streakData.lastDate !== today) {
            streakData.current = 1;
        }
        
        streakData.lastDate = today;
        localStorage.setItem(STREAK_KEY, JSON.stringify(streakData));
    }
    
    const streakEl = document.getElementById('streak-days');
    if (streakEl) {
        streakEl.textContent = streakData.current || 0;
    }
}

// Show reward notification
function showReward(message) {
    // Remove existing reward
    const existing = document.querySelector('.reward-notification');
    if (existing) existing.remove();
    
    const reward = document.createElement('div');
    reward.className = 'reward-notification';
    reward.textContent = message;
    document.body.appendChild(reward);
    
    setTimeout(() => {
        reward.classList.add('fade-out');
        setTimeout(() => reward.remove(), 500);
    }, 2000);
}

// Auto-save on checkbox change
function autoSave() {
    const date = document.getElementById('tracker-date')?.value;
    if (!date) return;
    
    // Debounce auto-save
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
        saveTrackerData({ preventDefault: () => {} }, true); // true = isAutoSave
    }, 1000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode first
    initDarkMode();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const trackerDate = document.getElementById('tracker-date');
    const reportDate = document.getElementById('report-date');
    
    if (trackerDate) trackerDate.value = today;
    if (reportDate) reportDate.value = today;
    
    // Load today's data if exists
    loadTrackerData();
    loadHistory();
    updateCompletion();
    
    // Add change listeners to all checkboxes for visual feedback
    getAllTaskCheckboxes().forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Add visual feedback
            const label = this.closest('.task-checkbox');
            if (label) {
                if (this.checked) {
                    label.classList.add('completed');
                    // Add celebration effect
                    createCelebrationEffect(label);
                } else {
                    label.classList.remove('completed');
                }
            }
        });
    });
});

// Create celebration effect
function createCelebrationEffect(element) {
    const emojis = ['✨', '🎉', '🌟', '💪', '🔥'];
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const emoji = document.createElement('span');
            emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            emoji.style.cssText = `
                position: absolute;
                font-size: 20px;
                pointer-events: none;
                animation: floatUp 1s ease-out forwards;
                left: ${Math.random() * 100}%;
                top: 50%;
            `;
            element.style.position = 'relative';
            element.appendChild(emoji);
            setTimeout(() => emoji.remove(), 1000);
        }, i * 100);
    }
}

// Tab switching
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    const tabEl = document.getElementById(tabName + '-tab');
    if (tabEl) tabEl.classList.add('active');
    
    // Add active class to clicked button
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Load data if switching to history
    if (tabName === 'history') {
        loadHistory();
    }
}

// Set date to today
function setToday() {
    const today = new Date().toISOString().split('T')[0];
    const trackerDate = document.getElementById('tracker-date');
    if (trackerDate) {
        trackerDate.value = today;
        loadTrackerData();
    }
}

// Load tracker data for selected date
function loadTrackerData() {
    const date = document.getElementById('tracker-date')?.value;
    if (!date) return;
    
    const data = getStoredData();
    const dayData = data[date] || {};
    
    // Helper function to safely set value
    const setValue = (id, value) => {
        const el = document.getElementById(id);
        if (el && value !== undefined && value !== null) {
            el.value = value;
        }
    };
    
    const setChecked = (id, value) => {
        const el = document.getElementById(id);
        if (el) el.checked = value || false;
    };
    
    // Load sleep data
    setValue('bedtime', dayData.bedtime);
    setValue('wake-time', dayData.wakeTime);
    setValue('sleep-duration', dayData.sleepDuration);
    setValue('sleep-quality', dayData.sleepQuality);
    
    // Load energy data
    setValue('energy-morning', dayData.energyMorning);
    setValue('energy-afternoon', dayData.energyAfternoon);
    setValue('energy-evening', dayData.energyEvening);
    
    // Load mood & stress
    setValue('mood', dayData.mood);
    setValue('stress', dayData.stress);
    setValue('notes', dayData.notes);
    
    // Load all checkboxes
    const checkboxFields = [
        'no-phone', 'get-out-bed', 'morning-sunlight', 'lemon-water', 'acv',
        'meditation', 'gratitude', 'l-tyrosine', 'pre-workout-hydration',
        'strength-training', 'zone2-training', 'zone5-training', 'flexibility',
        'recovery-break', 'shower-completed', 'post-shower-skincare', 'green-tea-post-workout',
        'focus-work-1', 'phone-away', 'caffeine-timing', 'breakfast-completed',
        'supp-vitamin-d', 'supp-vitamin-c', 'supp-omega3', 'supp-turmeric', 'supp-coq10',
        'supp-nr-nmn', 'supp-lions-mane', 'supp-spermidine', 'post-breakfast-walk',
        'focus-work-2', 'sunlight-walk', 'deep-work-1', 'mid-morning-snack',
        'focus-work-3', 'lunch-completed', 'supp-vitamin-k2', 'supp-garlic',
        'supp-magnesium-lunch', 'supp-b-complex', 'post-lunch-walk',
        'light-work-1', 'green-tea-afternoon', 'study-work-afternoon', 'nsdr',
        'afternoon-snack', 'work-continuation', 'work-wrap-up',
        'system-design-study', 'plan-next-day', 'dinner-completed', 'play-with-daughter',
        'post-dinner-walk', 'digital-sunset', 'herbal-tea', 'light-reading',
        'evening-journal', 'gratitude-reflection', 'supp-ashwagandha', 'supp-magnesium',
        'supp-l-theanine', 'evening-skincare', 'sleep-environment', 'prepare-clothes',
        'final-meditation', 'final-supplements'
    ];
    
    checkboxFields.forEach(field => {
        setChecked(field, dayData[field]);
    });
    
    // Load text fields
    const textFields = {
        'sunlight-duration': dayData.sunlightDuration,
        'meditation-duration': dayData.meditationDuration,
        'gratitude-items': dayData.gratitudeItems,
        'strength-focus': dayData.strengthFocus,
        'strength-duration': dayData.strengthDuration,
        'strength-exercises': dayData.strengthExercises,
        'cardio-type': dayData.cardioType,
        'cardio-duration': dayData.cardioDuration,
        'flexibility-duration': dayData.flexibilityDuration,
        'green-tea-amount': dayData.greenTeaAmount,
        'work-type-1': dayData.workType1,
        'work-duration-1': dayData.workDuration1,
        'work-tasks-1': dayData.workTasks1,
        'breakfast-time': dayData.breakfastTime,
        'breakfast-meal': dayData.breakfastMeal,
        'breakfast-protein': dayData.breakfastProtein,
        'breakfast-carbs': dayData.breakfastCarbs,
        'breakfast-fats': dayData.breakfastFats,
        'breakfast-fiber': dayData.breakfastFiber,
        'work-type-2': dayData.workType2,
        'work-duration-2': dayData.workDuration2,
        'work-tasks-2': dayData.workTasks2,
        'deep-work-type-1': dayData.deepWorkType1,
        'deep-work-duration-1': dayData.deepWorkDuration1,
        'deep-work-tasks-1': dayData.deepWorkTasks1,
        'snack-choice': dayData.snackChoice,
        'work-type-3': dayData.workType3,
        'work-duration-3': dayData.workDuration3,
        'work-tasks-3': dayData.workTasks3,
        'lunch-time': dayData.lunchTime,
        'lunch-meal': dayData.lunchMeal,
        'lunch-protein': dayData.lunchProtein,
        'lunch-carbs': dayData.lunchCarbs,
        'lunch-fats': dayData.lunchFats,
        'lunch-fiber': dayData.lunchFiber,
        'light-work-type-1': dayData.lightWorkType1,
        'afternoon-work-type': dayData.afternoonWorkType,
        'nsdr-duration': dayData.nsdrDuration,
        'afternoon-snack-choice': dayData.afternoonSnackChoice,
        'study-topic': dayData.studyTopic,
        'next-day-tasks': dayData.nextDayTasks,
        'dinner-time': dayData.dinnerTime || '19:00',
        'dinner-meal': dayData.dinnerMeal,
        'dinner-protein': dayData.dinnerProtein,
        'dinner-carbs': dayData.dinnerCarbs,
        'dinner-fats': dayData.dinnerFats,
        'dinner-fiber': dayData.dinnerFiber,
        'play-activities': dayData.playActivities
    };
    
    Object.entries(textFields).forEach(([id, value]) => {
        setValue(id, value);
    });
    
    // Update completion after loading
    setTimeout(updateCompletion, 100);
}

// Save tracker data
function saveTrackerData(event, isAutoSave = false) {
    if (event && event.preventDefault) {
        event.preventDefault();
    }
    
    const date = document.getElementById('tracker-date')?.value;
    if (!date) {
        if (!isAutoSave) {
            alert('Please select a date');
        }
        return;
    }
    
    const data = getStoredData();
    
    // Helper to get value
    const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : '';
    };
    
    const getNumber = (id) => {
        const el = document.getElementById(id);
        return el ? (parseInt(el.value) || 0) : 0;
    };
    
    const getFloat = (id) => {
        const el = document.getElementById(id);
        return el ? (parseFloat(el.value) || null) : null;
    };
    
    const getChecked = (id) => {
        const el = document.getElementById(id);
        return el ? el.checked : false;
    };
    
    data[date] = {
        date: date,
        // Sleep
        bedtime: getValue('bedtime'),
        wakeTime: getValue('wake-time'),
        sleepDuration: getFloat('sleep-duration'),
        sleepQuality: getNumber('sleep-quality'),
        // Energy
        energyMorning: getNumber('energy-morning'),
        energyAfternoon: getNumber('energy-afternoon'),
        energyEvening: getNumber('energy-evening'),
        // Mood
        mood: getNumber('mood'),
        stress: getNumber('stress'),
        notes: getValue('notes'),
        // Morning routine
        noPhone: getChecked('no-phone'),
        getOutBed: getChecked('get-out-bed'),
        morningSunlight: getChecked('morning-sunlight'),
        sunlightDuration: getNumber('sunlight-duration'),
        lemonWater: getChecked('lemon-water'),
        acv: getChecked('acv'),
        meditation: getChecked('meditation'),
        meditationDuration: getNumber('meditation-duration'),
        gratitude: getChecked('gratitude'),
        gratitudeItems: getValue('gratitude-items'),
        // Exercise
        lTyrosine: getChecked('l-tyrosine'),
        preWorkoutHydration: getChecked('pre-workout-hydration'),
        strengthTraining: getChecked('strength-training'),
        strengthFocus: getValue('strength-focus'),
        strengthDuration: getNumber('strength-duration'),
        strengthExercises: getValue('strength-exercises'),
        zone2Training: getChecked('zone2-training'),
        cardioType: getValue('cardio-type'),
        cardioDuration: getNumber('cardio-duration'),
        zone5Training: getChecked('zone5-training'),
        flexibility: getChecked('flexibility'),
        flexibilityDuration: getNumber('flexibility-duration'),
        recoveryBreak: getChecked('recovery-break'),
        showerCompleted: getChecked('shower-completed'),
        postShowerSkincare: getChecked('post-shower-skincare'),
        greenTeaPostWorkout: getChecked('green-tea-post-workout'),
        greenTeaAmount: getNumber('green-tea-amount'),
        // Work blocks
        focusWork1: getChecked('focus-work-1'),
        phoneAway: getChecked('phone-away'),
        caffeineTiming: getChecked('caffeine-timing'),
        workType1: getValue('work-type-1'),
        workDuration1: getNumber('work-duration-1'),
        workTasks1: getValue('work-tasks-1'),
        // Breakfast
        breakfastCompleted: getChecked('breakfast-completed'),
        breakfastTime: getValue('breakfast-time'),
        breakfastMeal: getValue('breakfast-meal'),
        breakfastProtein: getNumber('breakfast-protein'),
        breakfastCarbs: getNumber('breakfast-carbs'),
        breakfastFats: getNumber('breakfast-fats'),
        breakfastFiber: getNumber('breakfast-fiber'),
        // Supplements morning
        suppVitaminD: getChecked('supp-vitamin-d'),
        suppVitaminC: getChecked('supp-vitamin-c'),
        suppOmega3: getChecked('supp-omega3'),
        suppTurmeric: getChecked('supp-turmeric'),
        suppCoq10: getChecked('supp-coq10'),
        suppNrNmn: getChecked('supp-nr-nmn'),
        suppLionsMane: getChecked('supp-lions-mane'),
        suppSpermidine: getChecked('supp-spermidine'),
        postBreakfastWalk: getChecked('post-breakfast-walk'),
        // Work block 2
        focusWork2: getChecked('focus-work-2'),
        workType2: getValue('work-type-2'),
        workDuration2: getNumber('work-duration-2'),
        workTasks2: getValue('work-tasks-2'),
        sunlightWalk: getChecked('sunlight-walk'),
        // Deep work
        deepWork1: getChecked('deep-work-1'),
        deepWorkType1: getValue('deep-work-type-1'),
        deepWorkDuration1: getNumber('deep-work-duration-1'),
        deepWorkTasks1: getValue('deep-work-tasks-1'),
        midMorningSnack: getChecked('mid-morning-snack'),
        snackChoice: getValue('snack-choice'),
        focusWork3: getChecked('focus-work-3'),
        workType3: getValue('work-type-3'),
        workDuration3: getNumber('work-duration-3'),
        workTasks3: getValue('work-tasks-3'),
        // Lunch
        lunchCompleted: getChecked('lunch-completed'),
        lunchTime: getValue('lunch-time'),
        lunchMeal: getValue('lunch-meal'),
        lunchProtein: getNumber('lunch-protein'),
        lunchCarbs: getNumber('lunch-carbs'),
        lunchFats: getNumber('lunch-fats'),
        lunchFiber: getNumber('lunch-fiber'),
        suppVitaminK2: getChecked('supp-vitamin-k2'),
        suppGarlic: getChecked('supp-garlic'),
        suppMagnesiumLunch: getChecked('supp-magnesium-lunch'),
        suppBComplex: getChecked('supp-b-complex'),
        postLunchWalk: getChecked('post-lunch-walk'),
        // Afternoon
        lightWork1: getChecked('light-work-1'),
        lightWorkType1: getValue('light-work-type-1'),
        greenTeaAfternoon: getChecked('green-tea-afternoon'),
        studyWorkAfternoon: getChecked('study-work-afternoon'),
        afternoonWorkType: getValue('afternoon-work-type'),
        nsdr: getChecked('nsdr'),
        nsdrDuration: getNumber('nsdr-duration'),
        afternoonSnack: getChecked('afternoon-snack'),
        afternoonSnackChoice: getValue('afternoon-snack-choice'),
        workContinuation: getChecked('work-continuation'),
        workWrapUp: getChecked('work-wrap-up'),
        // Evening
        systemDesignStudy: getChecked('system-design-study'),
        studyTopic: getValue('study-topic'),
        planNextDay: getChecked('plan-next-day'),
        nextDayTasks: getValue('next-day-tasks'),
        dinnerCompleted: getChecked('dinner-completed'),
        dinnerTime: getValue('dinner-time') || '19:00',
        dinnerMeal: getValue('dinner-meal'),
        dinnerProtein: getNumber('dinner-protein'),
        dinnerCarbs: getNumber('dinner-carbs'),
        dinnerFats: getNumber('dinner-fats'),
        dinnerFiber: getNumber('dinner-fiber'),
        playWithDaughter: getChecked('play-with-daughter'),
        playActivities: getValue('play-activities'),
        postDinnerWalk: getChecked('post-dinner-walk'),
        digitalSunset: getChecked('digital-sunset'),
        herbalTea: getChecked('herbal-tea'),
        lightReading: getChecked('light-reading'),
        eveningJournal: getChecked('evening-journal'),
        gratitudeReflection: getChecked('gratitude-reflection'),
        suppAshwagandha: getChecked('supp-ashwagandha'),
        suppMagnesium: getChecked('supp-magnesium'),
        suppLTheanine: getChecked('supp-l-theanine'),
        eveningSkincare: getChecked('evening-skincare'),
        sleepEnvironment: getChecked('sleep-environment'),
        prepareClothes: getChecked('prepare-clothes'),
        finalMeditation: getChecked('final-meditation'),
        finalSupplements: getChecked('final-supplements')
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Show success message only on manual save (not auto-save)
    if (!isAutoSave) {
        showNotification('✅ Tracker data saved successfully!');
    }
    
    // Reload history
    loadHistory();
    updateCompletion();
}

// Get stored data
function getStoredData() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
}

// Load history
function loadHistory() {
    const data = getStoredData();
    const historyList = document.getElementById('history-list');
    
    if (!historyList) return;
    
    const dates = Object.keys(data).sort().reverse();
    
    if (dates.length === 0) {
        historyList.innerHTML = '<p>No tracker data yet. Start tracking today!</p>';
        return;
    }
    
    historyList.innerHTML = dates.map(date => {
        const dayData = data[date];
        const score = calculateProductivityScore ? calculateProductivityScore(dayData) : 0;
        const completion = calculateDayCompletion(dayData);
        
        return `
            <div class="history-item" onclick="loadDate('${date}')">
                <h3>${formatDate(date)}</h3>
                <div class="score">Score: ${score.toFixed(1)}/100</div>
                <div class="completion">Completion: ${completion}%</div>
                <p>Sleep: ${dayData.sleepQuality || 'N/A'}/10</p>
                <p>Energy: ${calculateAverageEnergy(dayData)}/10</p>
            </div>
        `;
    }).join('');
}

// Calculate day completion
function calculateDayCompletion(dayData) {
    if (!dayData) return 0;
    const checkboxes = getAllTaskCheckboxes();
    if (checkboxes.length === 0) return 0;
    
    let checked = 0;
    checkboxes.forEach(cb => {
        const fieldName = cb.id.replace(/-/g, '');
        const camelCase = fieldName.charAt(0).toLowerCase() + fieldName.slice(1).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        if (dayData[camelCase] || dayData[cb.id]) {
            checked++;
        }
    });
    
    return Math.round((checked / checkboxes.length) * 100);
}

// Load date in tracker
function loadDate(date) {
    const trackerDate = document.getElementById('tracker-date');
    if (trackerDate) {
        trackerDate.value = date;
        showTab('tracker');
        loadTrackerData();
    }
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Calculate average energy
function calculateAverageEnergy(dayData) {
    if (!dayData) return 'N/A';
    const energies = [dayData.energyMorning, dayData.energyAfternoon, dayData.energyEvening].filter(e => e !== null && e !== undefined);
    if (energies.length === 0) return 'N/A';
    return (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1);
}

// Show notification
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    @keyframes floatUp {
        from {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        to {
            transform: translateY(-100px) scale(0.5);
            opacity: 0;
        }
    }
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    }
    .notification.fade-out {
        animation: slideOut 0.3s ease-out;
    }
    .reward-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 30px 40px;
        border-radius: 15px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 2000;
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        animation: slideIn 0.5s ease-out;
    }
    .reward-notification.fade-out {
        animation: slideOut 0.5s ease-out;
    }
    .task-checkbox.completed {
        background: #d1fae5;
        border-color: #10b981;
    }
    .task-checkbox.completed span {
        text-decoration: line-through;
        opacity: 0.7;
    }
`;
document.head.appendChild(style);

// ==================== DATA EXPORT/IMPORT ====================

// Export all tracker data as JSON
function exportAllData() {
    const data = getStoredData();
    const streakData = JSON.parse(localStorage.getItem(STREAK_KEY) || '{"current": 0, "lastDate": ""}');
    
    const exportData = {
        version: '1.0',
        exportDate: new Date().toISOString(),
        trackerData: data,
        streakData: streakData
    };
    
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `longevity_tracker_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('✅ Data exported successfully!');
}

// Import tracker data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importData = JSON.parse(e.target.result);
            
            // Validate data structure
            if (!importData.trackerData) {
                throw new Error('Invalid file format: missing trackerData');
            }
            
            // Confirm before overwriting
            if (Object.keys(getStoredData()).length > 0) {
                if (!confirm('This will overwrite your existing data. Continue?')) {
                    return;
                }
            }
            
            // Import tracker data
            localStorage.setItem(STORAGE_KEY, JSON.stringify(importData.trackerData));
            
            // Import streak data if available
            if (importData.streakData) {
                localStorage.setItem(STREAK_KEY, JSON.stringify(importData.streakData));
            }
            
            showNotification('✅ Data imported successfully!');
            loadHistory();
            updateCompletion();
            
            // Reset file input
            event.target.value = '';
        } catch (error) {
            alert('Error importing data: ' + error.message);
            console.error('Import error:', error);
        }
    };
    reader.readAsText(file);
}

// Export data to CSV
function exportToCSV() {
    const data = getStoredData();
    const dates = Object.keys(data).sort();
    
    if (dates.length === 0) {
        alert('No data to export');
        return;
    }
    
    // CSV headers
    const headers = [
        'Date',
        'Sleep Duration (hours)',
        'Sleep Quality (1-10)',
        'Energy Morning (1-10)',
        'Energy Afternoon (1-10)',
        'Energy Evening (1-10)',
        'Mood (1-10)',
        'Stress (1-10)',
        'Strength Training',
        'Cardio',
        'Breakfast Protein (g)',
        'Lunch Protein (g)',
        'Dinner Protein (g)',
        'Total Protein (g)',
        'Completion %'
    ];
    
    // CSV rows
    const rows = dates.map(date => {
        const dayData = data[date];
        const completion = calculateDayCompletion(dayData);
        const totalProtein = (dayData.breakfastProtein || 0) + (dayData.lunchProtein || 0) + (dayData.dinnerProtein || 0);
        
        return [
            date,
            dayData.sleepDuration || '',
            dayData.sleepQuality || '',
            dayData.energyMorning || '',
            dayData.energyAfternoon || '',
            dayData.energyEvening || '',
            dayData.mood || '',
            dayData.stress || '',
            dayData.strengthTraining ? 'Yes' : 'No',
            dayData.zone2Training || dayData.zone5Training ? 'Yes' : 'No',
            dayData.breakfastProtein || 0,
            dayData.lunchProtein || 0,
            dayData.dinnerProtein || 0,
            totalProtein,
            completion
        ];
    });
    
    // Combine headers and rows
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `longevity_tracker_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    showNotification('✅ CSV exported successfully!');
}

// ==================== DARK MODE ====================

// Toggle dark mode
function toggleDarkMode() {
    const body = document.body;
    const isDark = body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    
    // Update button icon
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (toggleBtn) {
        toggleBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

// Initialize dark mode on page load
function initDarkMode() {
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'enabled') {
        document.body.classList.add('dark-mode');
        const toggleBtn = document.getElementById('dark-mode-toggle');
        if (toggleBtn) {
            toggleBtn.textContent = '☀️';
        }
    }
}

// ==================== WEEKLY/MONTHLY SUMMARIES ====================

// Show summary (weekly or monthly)
function showSummary(type) {
    // Update active button
    document.querySelectorAll('.tab-btn-small').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const summaryContent = document.getElementById('summary-content');
    
    if (type === 'weekly') {
        summaryContent.innerHTML = generateWeeklySummary();
    } else {
        summaryContent.innerHTML = generateMonthlySummary();
    }
}

// Generate weekly summary
function generateWeeklySummary() {
    const data = getStoredData();
    const dates = Object.keys(data).sort().reverse();
    
    if (dates.length === 0) {
        return '<p>No data available for weekly summary.</p>';
    }
    
    // Get last 7 days
    const last7Days = dates.slice(0, 7);
    const weekData = last7Days.map(date => data[date]).filter(d => d);
    
    if (weekData.length === 0) {
        return '<p>No data available for the last 7 days.</p>';
    }
    
    // Calculate averages
    const avgSleepDuration = weekData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / weekData.length;
    const avgSleepQuality = weekData.reduce((sum, d) => sum + (d.sleepQuality || 0), 0) / weekData.length;
    const avgEnergyMorning = weekData.reduce((sum, d) => sum + (d.energyMorning || 0), 0) / weekData.length;
    const avgEnergyAfternoon = weekData.reduce((sum, d) => sum + (d.energyAfternoon || 0), 0) / weekData.length;
    const avgEnergyEvening = weekData.reduce((sum, d) => sum + (d.energyEvening || 0), 0) / weekData.length;
    const avgMood = weekData.reduce((sum, d) => sum + (d.mood || 0), 0) / weekData.length;
    const avgStress = weekData.reduce((sum, d) => sum + (d.stress || 0), 0) / weekData.length;
    
    // Count habits
    const strengthDays = weekData.filter(d => d.strengthTraining).length;
    const cardioDays = weekData.filter(d => d.zone2Training || d.zone5Training).length;
    const sunlightDays = weekData.filter(d => d.morningSunlight).length;
    const meditationDays = weekData.filter(d => d.meditation).length;
    
    // Calculate average completion
    const avgCompletion = weekData.reduce((sum, d) => {
        return sum + calculateDayCompletion(d);
    }, 0) / weekData.length;
    
    return `
        <div class="summary-card">
            <h3>📅 Last 7 Days Summary</h3>
            <p><strong>Days Tracked:</strong> ${weekData.length}/7</p>
            <p><strong>Average Completion:</strong> ${avgCompletion.toFixed(1)}%</p>
        </div>
        
        <div class="metric-card">
            <h3>😴 Sleep</h3>
            <p><strong>Avg Duration:</strong> ${avgSleepDuration.toFixed(1)} hours</p>
            <p><strong>Avg Quality:</strong> ${avgSleepQuality.toFixed(1)}/10</p>
        </div>
        
        <div class="metric-card">
            <h3>⚡ Energy</h3>
            <p><strong>Morning:</strong> ${avgEnergyMorning.toFixed(1)}/10</p>
            <p><strong>Afternoon:</strong> ${avgEnergyAfternoon.toFixed(1)}/10</p>
            <p><strong>Evening:</strong> ${avgEnergyEvening.toFixed(1)}/10</p>
        </div>
        
        <div class="metric-card">
            <h3>🏋️ Exercise</h3>
            <p><strong>Strength Training:</strong> ${strengthDays}/7 days</p>
            <p><strong>Cardio:</strong> ${cardioDays}/7 days</p>
        </div>
        
        <div class="metric-card">
            <h3>✅ Habits</h3>
            <p><strong>Morning Sunlight:</strong> ${sunlightDays}/7 days</p>
            <p><strong>Meditation:</strong> ${meditationDays}/7 days</p>
        </div>
        
        <div class="metric-card">
            <h3>😊 Mood & Stress</h3>
            <p><strong>Avg Mood:</strong> ${avgMood.toFixed(1)}/10</p>
            <p><strong>Avg Stress:</strong> ${avgStress.toFixed(1)}/10</p>
        </div>
    `;
}

// Generate monthly summary
function generateMonthlySummary() {
    const data = getStoredData();
    const dates = Object.keys(data).sort().reverse();
    
    if (dates.length === 0) {
        return '<p>No data available for monthly summary.</p>';
    }
    
    // Get last 30 days
    const last30Days = dates.slice(0, 30);
    const monthData = last30Days.map(date => data[date]).filter(d => d);
    
    if (monthData.length === 0) {
        return '<p>No data available for the last 30 days.</p>';
    }
    
    // Calculate averages
    const avgSleepDuration = monthData.reduce((sum, d) => sum + (d.sleepDuration || 0), 0) / monthData.length;
    const avgSleepQuality = monthData.reduce((sum, d) => sum + (d.sleepQuality || 0), 0) / monthData.length;
    const avgEnergyMorning = monthData.reduce((sum, d) => sum + (d.energyMorning || 0), 0) / monthData.length;
    const avgMood = monthData.reduce((sum, d) => sum + (d.mood || 0), 0) / monthData.length;
    const avgStress = monthData.reduce((sum, d) => sum + (d.stress || 0), 0) / monthData.length;
    
    // Count habits
    const strengthDays = monthData.filter(d => d.strengthTraining).length;
    const cardioDays = monthData.filter(d => d.zone2Training || d.zone5Training).length;
    const sunlightDays = monthData.filter(d => d.morningSunlight).length;
    const meditationDays = monthData.filter(d => d.meditation).length;
    
    // Calculate average completion
    const avgCompletion = monthData.reduce((sum, d) => {
        return sum + calculateDayCompletion(d);
    }, 0) / monthData.length;
    
    // Calculate consistency (days with >80% completion)
    const consistentDays = monthData.filter(d => calculateDayCompletion(d) >= 80).length;
    const consistencyRate = (consistentDays / monthData.length * 100).toFixed(1);
    
    return `
        <div class="summary-card">
            <h3>📆 Last 30 Days Summary</h3>
            <p><strong>Days Tracked:</strong> ${monthData.length}/30</p>
            <p><strong>Average Completion:</strong> ${avgCompletion.toFixed(1)}%</p>
            <p><strong>Consistency Rate:</strong> ${consistencyRate}% (${consistentDays} days with >80% completion)</p>
        </div>
        
        <div class="metric-card">
            <h3>😴 Sleep</h3>
            <p><strong>Avg Duration:</strong> ${avgSleepDuration.toFixed(1)} hours</p>
            <p><strong>Avg Quality:</strong> ${avgSleepQuality.toFixed(1)}/10</p>
        </div>
        
        <div class="metric-card">
            <h3>⚡ Energy</h3>
            <p><strong>Morning Average:</strong> ${avgEnergyMorning.toFixed(1)}/10</p>
        </div>
        
        <div class="metric-card">
            <h3>🏋️ Exercise</h3>
            <p><strong>Strength Training:</strong> ${strengthDays}/30 days (${(strengthDays/30*100).toFixed(0)}%)</p>
            <p><strong>Cardio:</strong> ${cardioDays}/30 days (${(cardioDays/30*100).toFixed(0)}%)</p>
        </div>
        
        <div class="metric-card">
            <h3>✅ Habits</h3>
            <p><strong>Morning Sunlight:</strong> ${sunlightDays}/30 days (${(sunlightDays/30*100).toFixed(0)}%)</p>
            <p><strong>Meditation:</strong> ${meditationDays}/30 days (${(meditationDays/30*100).toFixed(0)}%)</p>
        </div>
        
        <div class="metric-card">
            <h3>😊 Mood & Stress</h3>
            <p><strong>Avg Mood:</strong> ${avgMood.toFixed(1)}/10</p>
            <p><strong>Avg Stress:</strong> ${avgStress.toFixed(1)}/10</p>
        </div>
    `;
}


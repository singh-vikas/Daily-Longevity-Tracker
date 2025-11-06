// Daily Tracker JavaScript
const STORAGE_KEY = 'longevity_tracker_data';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tracker-date').value = today;
    document.getElementById('report-date').value = today;
    
    // Load today's data if exists
    loadTrackerData();
    loadHistory();
});

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
    document.getElementById(tabName + '-tab').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load data if switching to history
    if (tabName === 'history') {
        loadHistory();
    }
}

// Set date to today
function setToday() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tracker-date').value = today;
    loadTrackerData();
}

// Load tracker data for selected date
function loadTrackerData() {
    const date = document.getElementById('tracker-date').value;
    if (!date) return;
    
    const data = getStoredData();
    const dayData = data[date] || {};
    
    // Load sleep data
    if (dayData.bedtime) document.getElementById('bedtime').value = dayData.bedtime;
    if (dayData.wakeTime) document.getElementById('wake-time').value = dayData.wakeTime;
    if (dayData.sleepDuration) document.getElementById('sleep-duration').value = dayData.sleepDuration;
    if (dayData.sleepQuality) document.getElementById('sleep-quality').value = dayData.sleepQuality;
    
    // Load energy data
    if (dayData.energyMorning) document.getElementById('energy-morning').value = dayData.energyMorning;
    if (dayData.energyAfternoon) document.getElementById('energy-afternoon').value = dayData.energyAfternoon;
    if (dayData.energyEvening) document.getElementById('energy-evening').value = dayData.energyEvening;
    
    // Load exercise data
    document.getElementById('exercise-strength').checked = dayData.exerciseStrength || false;
    document.getElementById('exercise-cardio').checked = dayData.exerciseCardio || false;
    document.getElementById('exercise-flexibility').checked = dayData.exerciseFlexibility || false;
    document.getElementById('cold-exposure').checked = dayData.coldExposure || false;
    if (dayData.exerciseStrengthDuration) document.getElementById('exercise-strength-duration').value = dayData.exerciseStrengthDuration;
    if (dayData.exerciseCardioDuration) document.getElementById('exercise-cardio-duration').value = dayData.exerciseCardioDuration;
    
    // Load nutrition data
    if (dayData.breakfast) {
        if (dayData.breakfast.time) document.getElementById('breakfast-time').value = dayData.breakfast.time;
        if (dayData.breakfast.protein) document.getElementById('breakfast-protein').value = dayData.breakfast.protein;
        if (dayData.breakfast.carbs) document.getElementById('breakfast-carbs').value = dayData.breakfast.carbs;
        if (dayData.breakfast.fats) document.getElementById('breakfast-fats').value = dayData.breakfast.fats;
    }
    
    if (dayData.lunch) {
        if (dayData.lunch.time) document.getElementById('lunch-time').value = dayData.lunch.time;
        if (dayData.lunch.protein) document.getElementById('lunch-protein').value = dayData.lunch.protein;
        if (dayData.lunch.carbs) document.getElementById('lunch-carbs').value = dayData.lunch.carbs;
        if (dayData.lunch.fats) document.getElementById('lunch-fats').value = dayData.lunch.fats;
    }
    
    if (dayData.dinner) {
        if (dayData.dinner.time) document.getElementById('dinner-time').value = dayData.dinner.time;
        if (dayData.dinner.protein) document.getElementById('dinner-protein').value = dayData.dinner.protein;
        if (dayData.dinner.carbs) document.getElementById('dinner-carbs').value = dayData.dinner.carbs;
        if (dayData.dinner.fats) document.getElementById('dinner-fats').value = dayData.dinner.fats;
    }
    
    // Load habits
    document.getElementById('habit-morning-sunlight').checked = dayData.habitMorningSunlight || false;
    document.getElementById('habit-meditation').checked = dayData.habitMeditation || false;
    document.getElementById('habit-supplements').checked = dayData.habitSupplements || false;
    document.getElementById('habit-digital-sunset').checked = dayData.habitDigitalSunset || false;
    document.getElementById('habit-social').checked = dayData.habitSocial || false;
    document.getElementById('habit-nature').checked = dayData.habitNature || false;
    
    // Load mood
    if (dayData.mood) document.getElementById('mood').value = dayData.mood;
    if (dayData.stress) document.getElementById('stress').value = dayData.stress;
    if (dayData.notes) document.getElementById('notes').value = dayData.notes;
}

// Save tracker data
function saveTrackerData(event) {
    event.preventDefault();
    
    const date = document.getElementById('tracker-date').value;
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    const data = getStoredData();
    
    data[date] = {
        date: date,
        bedtime: document.getElementById('bedtime').value,
        wakeTime: document.getElementById('wake-time').value,
        sleepDuration: parseFloat(document.getElementById('sleep-duration').value) || null,
        sleepQuality: parseInt(document.getElementById('sleep-quality').value) || null,
        energyMorning: parseInt(document.getElementById('energy-morning').value) || null,
        energyAfternoon: parseInt(document.getElementById('energy-afternoon').value) || null,
        energyEvening: parseInt(document.getElementById('energy-evening').value) || null,
        exerciseStrength: document.getElementById('exercise-strength').checked,
        exerciseCardio: document.getElementById('exercise-cardio').checked,
        exerciseFlexibility: document.getElementById('exercise-flexibility').checked,
        coldExposure: document.getElementById('cold-exposure').checked,
        exerciseStrengthDuration: parseInt(document.getElementById('exercise-strength-duration').value) || 0,
        exerciseCardioDuration: parseInt(document.getElementById('exercise-cardio-duration').value) || 0,
        breakfast: {
            time: document.getElementById('breakfast-time').value,
            protein: parseInt(document.getElementById('breakfast-protein').value) || 0,
            carbs: parseInt(document.getElementById('breakfast-carbs').value) || 0,
            fats: parseInt(document.getElementById('breakfast-fats').value) || 0
        },
        lunch: {
            time: document.getElementById('lunch-time').value,
            protein: parseInt(document.getElementById('lunch-protein').value) || 0,
            carbs: parseInt(document.getElementById('lunch-carbs').value) || 0,
            fats: parseInt(document.getElementById('lunch-fats').value) || 0
        },
        dinner: {
            time: document.getElementById('dinner-time').value,
            protein: parseInt(document.getElementById('dinner-protein').value) || 0,
            carbs: parseInt(document.getElementById('dinner-carbs').value) || 0,
            fats: parseInt(document.getElementById('dinner-fats').value) || 0
        },
        habitMorningSunlight: document.getElementById('habit-morning-sunlight').checked,
        habitMeditation: document.getElementById('habit-meditation').checked,
        habitSupplements: document.getElementById('habit-supplements').checked,
        habitDigitalSunset: document.getElementById('habit-digital-sunset').checked,
        habitSocial: document.getElementById('habit-social').checked,
        habitNature: document.getElementById('habit-nature').checked,
        mood: parseInt(document.getElementById('mood').value) || null,
        stress: parseInt(document.getElementById('stress').value) || null,
        notes: document.getElementById('notes').value
    };
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Show success message
    showNotification('✅ Tracker data saved successfully!');
    
    // Reload history
    loadHistory();
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
        const score = calculateProductivityScore(dayData);
        
        return `
            <div class="history-item" onclick="loadDate('${date}')">
                <h3>${formatDate(date)}</h3>
                <div class="score">Score: ${score.toFixed(1)}/100</div>
                <p>Sleep: ${dayData.sleepQuality || 'N/A'}/10</p>
                <p>Energy: ${calculateAverageEnergy(dayData)}/10</p>
            </div>
        `;
    }).join('');
}

// Load date in tracker
function loadDate(date) {
    document.getElementById('tracker-date').value = date;
    showTab('tracker');
    loadTrackerData();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}

// Calculate average energy
function calculateAverageEnergy(dayData) {
    const energies = [dayData.energyMorning, dayData.energyAfternoon, dayData.energyEvening].filter(e => e !== null);
    if (energies.length === 0) return 'N/A';
    return (energies.reduce((a, b) => a + b, 0) / energies.length).toFixed(1);
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
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
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animation
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
`;
document.head.appendChild(style);


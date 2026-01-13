// Habit Tracker App v4.0 - Complete with Quantity/Duration Tracking and Monthly View

// Data Structure
let habits = [];
let habitCompletions = {};

// Settings
let adhdMode = false;
let focusMode = false;
let notificationsEnabled = false;

// Monthly view state
let currentMonthView = new Date();

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initializeUI();
    updateStats();
    renderHabits();
    renderWeeklyCalendar();
    renderMonthlyView();
    checkInstallPrompt();
});

// Load data from localStorage
function loadData() {
    const savedHabits = localStorage.getItem('habits');
    const savedCompletions = localStorage.getItem('habitCompletions');
    
    if (savedHabits) {
        habits = JSON.parse(savedHabits);
        
        // Migrate old habits to new format
        habits = habits.map(habit => {
            if (!habit.trackingType) {
                return {
                    ...habit,
                    trackingType: 'simple',
                    unit: null,
                    dailyGoal: null,
                    color: habit.categoryColor || '#3b82f6'
                };
            }
            return habit;
        });
    }
    
    if (savedCompletions) {
        habitCompletions = JSON.parse(savedCompletions);
        
        // Migrate old completions to new format
        Object.keys(habitCompletions).forEach(habitId => {
            Object.keys(habitCompletions[habitId]).forEach(date => {
                const completion = habitCompletions[habitId][date];
                if (typeof completion === 'boolean') {
                    habitCompletions[habitId][date] = {
                        completed: completion,
                        value: completion ? 1 : 0,
                        entries: []
                    };
                }
            });
        });
    }
    
    // Load settings
    adhdMode = localStorage.getItem('adhd_mode') === 'true';
    focusMode = localStorage.getItem('focus_mode') === 'true';
    notificationsEnabled = localStorage.getItem('notifications_enabled') === 'true';
    
    if (adhdMode) {
        document.body.classList.add('adhd-mode');
    }
    
    if (focusMode) {
        document.getElementById('focusModeBanner').style.display = 'flex';
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('habitCompletions', JSON.stringify(habitCompletions));
}

// Initialize UI Elements
function initializeUI() {
    // Display current date
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateElement.textContent = today.toLocaleDateString('en-US', options);
    
    // Settings button
    const btnSettings = document.getElementById('btnSettings');
    const settingsModal = document.getElementById('settingsModal');
    const btnCloseSettings = document.getElementById('btnCloseSettings');
    
    btnSettings.addEventListener('click', () => {
        settingsModal.style.display = 'flex';
        document.getElementById('adhdModeToggle').checked = adhdMode;
        document.getElementById('focusModeToggle').checked = focusMode;
        updateNotificationStatus();
    });
    
    btnCloseSettings.addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });
    
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // ADHD Mode Toggle
    document.getElementById('adhdModeToggle').addEventListener('change', (e) => {
        adhdMode = e.target.checked;
        localStorage.setItem('adhd_mode', adhdMode);
        
        if (adhdMode) {
            document.body.classList.add('adhd-mode');
            showCelebration('🧠 ADHD Support Mode Activated!', 'You\'ve got this! 💪');
        } else {
            document.body.classList.remove('adhd-mode');
        }
        
        renderHabits();
    });
    
    // Focus Mode Toggle
    document.getElementById('focusModeToggle').addEventListener('change', (e) => {
        focusMode = e.target.checked;
        localStorage.setItem('focus_mode', focusMode);
        
        const focusModeBanner = document.getElementById('focusModeBanner');
        if (focusMode) {
            focusModeBanner.style.display = 'flex';
        } else {
            focusModeBanner.style.display = 'none';
        }
        
        renderHabits();
    });
    
    // Exit Focus Mode
    document.getElementById('btnExitFocus').addEventListener('click', () => {
        focusMode = false;
        localStorage.setItem('focus_mode', 'false');
        document.getElementById('focusModeToggle').checked = false;
        document.getElementById('focusModeBanner').style.display = 'none';
        renderHabits();
    });
    
    // Enable Notifications
    document.getElementById('btnEnableNotifications').addEventListener('click', async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                notificationsEnabled = true;
                localStorage.setItem('notifications_enabled', 'true');
                updateNotificationStatus();
                showCelebration('🔔 Notifications Enabled!', 'We\'ll help remind you!');
            }
        } else {
            alert('Notifications are not supported in your browser');
        }
    });
    
    // Add habit button
    const btnAddHabit = document.getElementById('btnAddHabit');
    const addHabitForm = document.getElementById('addHabitForm');
    const btnCancel = document.getElementById('btnCancel');
    const btnSave = document.getElementById('btnSave');
    
    btnAddHabit.addEventListener('click', () => {
        resetForm();
        document.getElementById('formTitle').textContent = 'Create New Habit';
        document.getElementById('btnSave').textContent = 'Create Habit';
        document.getElementById('editingHabitId').value = '';
        addHabitForm.style.display = 'block';
        document.getElementById('habitName').focus();
    });
    
    btnCancel.addEventListener('click', () => {
        addHabitForm.style.display = 'none';
        resetForm();
    });
    
    btnSave.addEventListener('click', saveHabit);
    
    // Icon selector
    const iconButtons = document.querySelectorAll('.icon-btn');
    iconButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            iconButtons.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('selectedIcon').value = btn.dataset.icon;
        });
    });
    
    // Category selector
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.classList.contains('selected')) {
                btn.classList.remove('selected');
                document.getElementById('selectedCategory').value = '';
                document.getElementById('selectedCategoryColor').value = '';
            } else {
                categoryButtons.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                document.getElementById('selectedCategory').value = btn.dataset.category;
                document.getElementById('selectedCategoryColor').value = btn.dataset.color;
            }
        });
    });
    
    // Tracking type selector
    const trackingTypeButtons = document.querySelectorAll('.tracking-type-btn');
    trackingTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            trackingTypeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const trackingType = btn.dataset.type;
            document.getElementById('selectedTrackingType').value = trackingType;
            
            document.getElementById('quantityOptions').style.display = trackingType === 'quantity' ? 'block' : 'none';
            document.getElementById('durationOptions').style.display = trackingType === 'duration' ? 'block' : 'none';
        });
    });
    
    // Color picker
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            colorButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('selectedColor').value = btn.dataset.color;
        });
    });
    
    // Monthly navigation
    document.getElementById('btnPrevMonth').addEventListener('click', () => {
        currentMonthView = new Date(currentMonthView.setMonth(currentMonthView.getMonth() - 1));
        renderMonthlyView();
    });
    
    document.getElementById('btnNextMonth').addEventListener('click', () => {
        currentMonthView = new Date(currentMonthView.setMonth(currentMonthView.getMonth() + 1));
        renderMonthlyView();
    });
    
    // View Modals
    const btnWeekView = document.getElementById('btnWeekView');
    const btnMonthView = document.getElementById('btnMonthView');
    const weekViewModal = document.getElementById('weekViewModal');
    const monthViewModal = document.getElementById('monthViewModal');
    const btnCloseWeek = document.getElementById('btnCloseWeek');
    const btnCloseMonth = document.getElementById('btnCloseMonth');
    
    btnWeekView.addEventListener('click', () => {
        weekViewModal.style.display = 'flex';
        renderWeeklyCalendar(); // Refresh the view
    });
    
    btnMonthView.addEventListener('click', () => {
        monthViewModal.style.display = 'flex';
        renderMonthlyView(); // Refresh the view
    });
    
    btnCloseWeek.addEventListener('click', () => {
        weekViewModal.style.display = 'none';
    });
    
    btnCloseMonth.addEventListener('click', () => {
        monthViewModal.style.display = 'none';
    });
    
    // Close modals on backdrop click
    weekViewModal.addEventListener('click', (e) => {
        if (e.target === weekViewModal) {
            weekViewModal.style.display = 'none';
        }
    });
    
    monthViewModal.addEventListener('click', (e) => {
        if (e.target === monthViewModal) {
            monthViewModal.style.display = 'none';
        }
    });
    
    // Time picker handlers
    const reminderHour = document.getElementById('reminderHour');
    const reminderMinute = document.getElementById('reminderMinute');
    const reminderTime = document.getElementById('reminderTime');
    
    function updateReminderTime() {
        if (reminderHour.value && reminderMinute.value) {
            reminderTime.value = `${reminderHour.value}:${reminderMinute.value}`;
        } else {
            reminderTime.value = '';
        }
    }
    
    reminderHour.addEventListener('change', updateReminderTime);
    reminderMinute.addEventListener('change', updateReminderTime);
    
    // Notes character counter
    const habitNotes = document.getElementById('habitNotes');
    const notesCharCount = document.getElementById('notesCharCount');
    
    habitNotes.addEventListener('input', () => {
        notesCharCount.textContent = habitNotes.value.length;
    });
    
    // Theme Selector
    const themeSelect = document.getElementById('themeSelect');
    const themeHint = document.getElementById('themeHint');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    // Theme descriptions for hints
    const themeDescriptions = {
        'dark': 'Dark theme active - Easy on eyes at night',
        'light-ocean': 'Ocean Blue - Professional and focused',
        'light-serenity': 'Serenity - Gentle & soothing therapeutic palette',
        'light-dawn': 'Dawn - Fresh start with warm optimism',
        'light-harmony': 'Harmony - Wellness-focused calming colors',
        'light-mist': 'Mist - Ultra calm minimal stimulation'
    };
    
    // Apply saved theme
    applyTheme(currentTheme);
    themeSelect.value = currentTheme;
    
    // Handle theme changes
    themeSelect.addEventListener('change', (e) => {
        const selectedTheme = e.target.value;
        applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    });
    
    function applyTheme(themeName) {
        // Remove all theme classes
        document.body.classList.remove('light-ocean', 'light-serenity', 'light-dawn', 'light-harmony', 'light-mist');
        
        // Apply selected theme (dark is default, no class needed)
        if (themeName !== 'dark') {
            document.body.classList.add(themeName);
        }
        
        // Update hint text
        themeHint.textContent = themeDescriptions[themeName] || 'Theme active';
        
        // Optional: Show celebration for ADHD users when they switch themes
        if (adhdMode && themeName !== currentTheme) {
            showCelebration('🎨 Theme Changed!', 'Looking good! Try it out! ✨');
        }
    }
    
    // Export to CSV
    document.getElementById('btnExportData').addEventListener('click', exportToCSV);
    
    // Tracking Modal
    initializeTrackingModal();
    
    iconButtons[0].classList.add('selected');
    
    document.getElementById('habitName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveHabit();
        }
    });
}

// Initialize Tracking Modal
function initializeTrackingModal() {
    const trackingModal = document.getElementById('trackingModal');
    const btnCloseTracking = document.getElementById('btnCloseTracking');
    const btnCancelTracking = document.getElementById('btnCancelTracking');
    const btnMarkComplete = document.getElementById('btnMarkComplete');
    const btnCustomAmount = document.getElementById('btnCustomAmount');
    const btnAddCustom = document.getElementById('btnAddCustom');
    
    btnCloseTracking.addEventListener('click', () => {
        trackingModal.style.display = 'none';
    });
    
    btnCancelTracking.addEventListener('click', () => {
        trackingModal.style.display = 'none';
    });
    
    trackingModal.addEventListener('click', (e) => {
        if (e.target === trackingModal) {
            trackingModal.style.display = 'none';
        }
    });
    
    // Custom amount button
    btnCustomAmount.addEventListener('click', () => {
        document.getElementById('customAmountSection').style.display = 'block';
        document.getElementById('customAmountInput').focus();
    });
    
    btnAddCustom.addEventListener('click', () => {
        const amount = parseFloat(document.getElementById('customAmountInput').value);
        if (amount && amount > 0) {
            addTrackingEntry(amount);
            document.getElementById('customAmountInput').value = '';
            document.getElementById('customAmountSection').style.display = 'none';
        }
    });
    
    btnMarkComplete.addEventListener('click', () => {
        const habitId = document.getElementById('trackingHabitId').value;
        const today = getTodayString();
        
        if (habitCompletions[habitId] && habitCompletions[habitId][today]) {
            habitCompletions[habitId][today].completed = true;
        }
        
        saveData();
        trackingModal.style.display = 'none';
        renderHabits();
        updateStats();
        renderWeeklyCalendar();
        renderMonthlyView();
        
        if (adhdMode) {
            showCelebration('🎉 Goal Complete!', 'Amazing work! Keep it up! 💪');
        }
    });
}

// Reset form
function resetForm() {
    document.getElementById('habitName').value = '';
    document.getElementById('editingHabitId').value = '';
    document.getElementById('reminderTime').value = '';
    document.getElementById('reminderHour').value = '';
    document.getElementById('reminderMinute').value = '';
    document.getElementById('habitNotes').value = '';
    document.getElementById('notesCharCount').textContent = '0';
    
    document.querySelectorAll('.tracking-type-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tracking-type-btn')[0].classList.add('active');
    document.getElementById('selectedTrackingType').value = 'simple';
    document.getElementById('quantityOptions').style.display = 'none';
    document.getElementById('durationOptions').style.display = 'none';
    document.getElementById('quantityUnit').value = 'cups';
    document.getElementById('quantityGoal').value = '';
    document.getElementById('durationGoal').value = '30';
    
    const iconButtons = document.querySelectorAll('.icon-btn');
    iconButtons.forEach(b => b.classList.remove('selected'));
    iconButtons[0].classList.add('selected');
    document.getElementById('selectedIcon').value = iconButtons[0].dataset.icon;
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(b => b.classList.remove('selected'));
    document.getElementById('selectedCategory').value = '';
    document.getElementById('selectedCategoryColor').value = '';
    
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(b => b.classList.remove('active'));
    colorButtons[0].classList.add('active');
    document.getElementById('selectedColor').value = colorButtons[0].dataset.color;
}

// Save habit
function saveHabit() {
    const habitName = document.getElementById('habitName').value.trim();
    const selectedIcon = document.getElementById('selectedIcon').value;
    const selectedCategory = document.getElementById('selectedCategory').value;
    const selectedCategoryColor = document.getElementById('selectedCategoryColor').value;
    const reminderTime = document.getElementById('reminderTime').value;
    const trackingType = document.getElementById('selectedTrackingType').value;
    const habitColor = document.getElementById('selectedColor').value;
    const habitNotes = document.getElementById('habitNotes').value.trim();
    const editingHabitId = document.getElementById('editingHabitId').value;
    
    let unit = null;
    let dailyGoal = null;
    
    if (trackingType === 'quantity') {
        unit = document.getElementById('quantityUnit').value;
        dailyGoal = parseInt(document.getElementById('quantityGoal').value) || null;
        if (!dailyGoal) {
            alert('Please enter a daily goal for quantity tracking');
            return;
        }
    } else if (trackingType === 'duration') {
        unit = 'minutes';
        dailyGoal = parseInt(document.getElementById('durationGoal').value) || 30;
    }
    
    if (!habitName) {
        alert('Please enter a habit name');
        return;
    }
    
    if (editingHabitId) {
        const habit = habits.find(h => h.id === editingHabitId);
        if (habit) {
            habit.name = habitName;
            habit.icon = selectedIcon;
            habit.category = selectedCategory;
            habit.categoryColor = selectedCategoryColor;
            habit.reminderTime = reminderTime;
            habit.trackingType = trackingType;
            habit.unit = unit;
            habit.dailyGoal = dailyGoal;
            habit.color = habitColor;
            habit.notes = habitNotes;
        }
    } else {
        const newHabit = {
            id: Date.now().toString(),
            name: habitName,
            icon: selectedIcon,
            category: selectedCategory,
            categoryColor: selectedCategoryColor,
            reminderTime: reminderTime,
            trackingType: trackingType,
            unit: unit,
            dailyGoal: dailyGoal,
            color: habitColor,
            notes: habitNotes,
            createdAt: new Date().toISOString()
        };
        
        habits.push(newHabit);
        habitCompletions[newHabit.id] = {};
    }
    
    saveData();
    renderHabits();
    updateStats();
    renderWeeklyCalendar();
    renderMonthlyView();
    
    document.getElementById('addHabitForm').style.display = 'none';
    resetForm();
}

// Edit habit
function editHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    document.getElementById('habitName').value = habit.name;
    document.getElementById('editingHabitId').value = habit.id;
    document.getElementById('formTitle').textContent = 'Edit Habit';
    document.getElementById('btnSave').textContent = 'Update Habit';
    
    // Set reminder time in dropdowns
    if (habit.reminderTime) {
        const [hour, minute] = habit.reminderTime.split(':');
        document.getElementById('reminderHour').value = hour || '';
        document.getElementById('reminderMinute').value = minute || '';
        document.getElementById('reminderTime').value = habit.reminderTime;
    } else {
        document.getElementById('reminderHour').value = '';
        document.getElementById('reminderMinute').value = '';
        document.getElementById('reminderTime').value = '';
    }
    
    // Set notes
    const notes = habit.notes || '';
    document.getElementById('habitNotes').value = notes;
    document.getElementById('notesCharCount').textContent = notes.length;
    
    const iconButtons = document.querySelectorAll('.icon-btn');
    iconButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.icon === habit.icon) {
            btn.classList.add('selected');
            document.getElementById('selectedIcon').value = habit.icon;
        }
    });
    
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => {
        btn.classList.remove('selected');
        if (habit.category && btn.dataset.category === habit.category) {
            btn.classList.add('selected');
            document.getElementById('selectedCategory').value = habit.category;
            document.getElementById('selectedCategoryColor').value = habit.categoryColor;
        }
    });
    
    const trackingType = habit.trackingType || 'simple';
    document.querySelectorAll('.tracking-type-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.type === trackingType) {
            btn.classList.add('active');
        }
    });
    document.getElementById('selectedTrackingType').value = trackingType;
    
    document.getElementById('quantityOptions').style.display = trackingType === 'quantity' ? 'block' : 'none';
    document.getElementById('durationOptions').style.display = trackingType === 'duration' ? 'block' : 'none';
    
    if (trackingType === 'quantity') {
        document.getElementById('quantityUnit').value = habit.unit || 'cups';
        document.getElementById('quantityGoal').value = habit.dailyGoal || '';
    } else if (trackingType === 'duration') {
        document.getElementById('durationGoal').value = habit.dailyGoal || '30';
    }
    
    const habitColor = habit.color || '#3b82f6';
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === habitColor) {
            btn.classList.add('active');
        }
    });
    document.getElementById('selectedColor').value = habitColor;
    
    document.getElementById('addHabitForm').style.display = 'block';
    document.getElementById('habitName').focus();
}

// Render habits list
function renderHabits() {
    const habitsList = document.getElementById('habitsList');
    const emptyState = document.getElementById('emptyState');
    
    if (habits.length === 0) {
        habitsList.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }
    
    habitsList.style.display = 'flex';
    emptyState.style.display = 'none';
    
    const today = getTodayString();
    let visibleHabits = habits;
    
    if (focusMode) {
        visibleHabits = habits.filter(habit => {
            const completion = habitCompletions[habit.id]?.[today];
            if (!completion) return true;
            
            if (habit.trackingType === 'simple') {
                return !completion.completed;
            } else {
                return completion.value < habit.dailyGoal;
            }
        });
    }
    
    if (visibleHabits.length === 0 && focusMode) {
        habitsList.innerHTML = `
            <div class="empty-state">
                <div class="celebration-emoji">🎉</div>
                <h3>${adhdMode ? 'You did it! All habits complete!' : 'All done for today!'}</h3>
                <p>${adhdMode ? 'Take a moment to celebrate your progress! 🌟' : 'Great job completing all your habits!'}</p>
            </div>
        `;
        return;
    }
    
    habitsList.innerHTML = visibleHabits.map((habit, index) => {
        const completion = habitCompletions[habit.id]?.[today] || { completed: false, value: 0, entries: [] };
        const isCompleted = completion.completed;
        const currentValue = completion.value || 0;
        const currentStreak = calculateStreak(habit.id);
        const longestStreak = calculateLongestStreak(habit.id);
        
        const categoryHTML = habit.category ? `
            <div class="habit-category" style="background: ${habit.categoryColor}20; color: ${habit.categoryColor};">
                ${habit.category}
            </div>
        ` : '';
        
        const streakText = adhdMode 
            ? (currentStreak > 0 ? `🔥 Amazing! ${currentStreak} day streak!` : 'Ready to start your streak!')
            : (currentStreak > 0 ? `🔥 ${currentStreak} day streak` : 'No current streak');
        
        const longestStreakText = longestStreak > 0 ? ` • Best: ${longestStreak} days` : '';
        
        let progressHTML = '';
        let actionsHTML = '';
        
        if (habit.trackingType === 'quantity' || habit.trackingType === 'duration') {
            const percentage = Math.min(100, Math.round((currentValue / habit.dailyGoal) * 100));
            const unitDisplay = habit.trackingType === 'duration' ? 'mins' : habit.unit;
            
            progressHTML = `
                <div class="habit-progress">
                    <div class="progress-label">
                        <span>${currentValue}</span>/<span>${habit.dailyGoal}</span> ${unitDisplay}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar-fill" style="width: ${percentage}%"></div>
                    </div>
                    <div class="progress-percentage">${percentage}% complete</div>
                </div>
            `;
            
            actionsHTML = `
                <button class="btn-check" onclick="openTrackingModal('${habit.id}')" title="Track progress">
                    ${isCompleted ? '✓' : '+'}
                </button>
            `;
        } else {
            actionsHTML = `
                <button class="btn-check ${isCompleted ? 'checked' : ''}" onclick="toggleHabit('${habit.id}')" title="${isCompleted ? 'Mark incomplete' : 'Mark complete'}">
                    ${isCompleted ? '✓' : '○'}
                </button>
            `;
        }
        
        const notesHTML = habit.notes ? `
            <div class="habit-notes">${habit.notes}</div>
        ` : '';
        
        return `
            <div class="habit-card ${isCompleted ? 'completed' : ''}" style="animation-delay: ${index * 0.1}s">
                <div class="habit-icon">${habit.icon}</div>
                <div class="habit-info">
                    <div class="habit-name">${habit.name}</div>
                    ${categoryHTML}
                    <div class="habit-streak ${currentStreak > 0 ? 'active' : ''}">
                        ${streakText}${longestStreakText}
                    </div>
                    ${progressHTML}
                    ${notesHTML}
                </div>
                <div class="habit-actions">
                    ${actionsHTML}
                    <button class="btn-edit" onclick="editHabit('${habit.id}')" title="Edit habit">
                        ✏️
                    </button>
                    <button class="btn-delete" onclick="deleteHabit('${habit.id}')" title="Delete habit">
                        🗑️
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Open tracking modal
function openTrackingModal(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const today = getTodayString();
    const completion = habitCompletions[habitId]?.[today] || { completed: false, value: 0, entries: [] };
    
    if (!habitCompletions[habitId]) {
        habitCompletions[habitId] = {};
    }
    if (!habitCompletions[habitId][today]) {
        habitCompletions[habitId][today] = { completed: false, value: 0, entries: [] };
    }
    
    document.getElementById('trackingHabitId').value = habitId;
    document.getElementById('trackingHabitIcon').textContent = habit.icon;
    document.getElementById('trackingHabitName').textContent = habit.name;
    document.getElementById('trackingModalTitle').textContent = `Track ${habit.name}`;
    
    const unitDisplay = habit.trackingType === 'duration' ? 'minutes' : habit.unit;
    document.getElementById('trackingUnit').textContent = unitDisplay;
    document.getElementById('trackingGoalValue').textContent = habit.dailyGoal;
    
    // Set context-aware quick add buttons
    setupQuickAddButtons(habit);
    
    updateTrackingModal(habitId);
    
    document.getElementById('trackingModal').style.display = 'flex';
}

// Setup context-aware quick add buttons
function setupQuickAddButtons(habit) {
    const quickAddContainer = document.querySelector('.quick-add-buttons');
    let buttons = [];
    
    if (habit.trackingType === 'duration') {
        // Duration: 15, 30, 45 minute increments
        buttons = [
            { amount: 15, label: '+15 min' },
            { amount: 30, label: '+30 min' },
            { amount: 45, label: '+45 min' }
        ];
    } else {
        // Quantity: context-aware based on unit
        switch(habit.unit) {
            case 'cups':
            case 'glasses':
                buttons = [
                    { amount: 1, label: '+1' },
                    { amount: 2, label: '+2' },
                    { amount: 3, label: '+3' }
                ];
                break;
            case 'oz':
                buttons = [
                    { amount: 8, label: '+8 oz' },
                    { amount: 16, label: '+16 oz' },
                    { amount: 24, label: '+24 oz' }
                ];
                break;
            case 'ml':
                buttons = [
                    { amount: 250, label: '+250 ml' },
                    { amount: 500, label: '+500 ml' },
                    { amount: 750, label: '+750 ml' }
                ];
                break;
            case 'liters':
                buttons = [
                    { amount: 0.25, label: '+0.25 L' },
                    { amount: 0.5, label: '+0.5 L' },
                    { amount: 1, label: '+1 L' }
                ];
                break;
            case 'pages':
                buttons = [
                    { amount: 10, label: '+10' },
                    { amount: 25, label: '+25' },
                    { amount: 50, label: '+50' }
                ];
                break;
            case 'reps':
                buttons = [
                    { amount: 10, label: '+10' },
                    { amount: 25, label: '+25' },
                    { amount: 50, label: '+50' }
                ];
                break;
            case 'times':
                buttons = [
                    { amount: 1, label: '+1' },
                    { amount: 2, label: '+2' },
                    { amount: 3, label: '+3' }
                ];
                break;
            default:
                // Generic fallback
                buttons = [
                    { amount: 1, label: '+1' },
                    { amount: 2, label: '+2' },
                    { amount: 5, label: '+5' }
                ];
        }
    }
    
    // Remove existing quick add buttons (except Custom button)
    const existingButtons = quickAddContainer.querySelectorAll('.btn-quick-add:not(#btnCustomAmount)');
    existingButtons.forEach(btn => btn.remove());
    
    // Add new context-aware buttons
    const customButton = document.getElementById('btnCustomAmount');
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = 'btn-quick-add';
        button.textContent = btn.label;
        button.dataset.amount = btn.amount;
        button.addEventListener('click', () => {
            addTrackingEntry(btn.amount);
        });
        quickAddContainer.insertBefore(button, customButton);
    });
}

// Update tracking modal display
// Update tracking modal display
function updateTrackingModal(habitId) {
    const habit = habits.find(h => h.id === habitId);
    const today = getTodayString();
    const completion = habitCompletions[habitId][today];
    
    const currentValue = completion.value || 0;
    const percentage = Math.min(100, Math.round((currentValue / habit.dailyGoal) * 100));
    
    // Format values (handle decimals nicely)
    const formattedValue = Number.isInteger(currentValue) ? currentValue : currentValue.toFixed(2);
    document.getElementById('trackingCurrentValue').textContent = formattedValue;
    document.getElementById('trackingProgressBar').style.width = percentage + '%';
    document.getElementById('trackingPercentage').textContent = percentage + '%';
    
    const entriesList = document.getElementById('trackingEntries');
    if (completion.entries && completion.entries.length > 0) {
        entriesList.innerHTML = completion.entries.map((entry, index) => {
            const formattedAmount = Number.isInteger(entry.amount) ? entry.amount : entry.amount.toFixed(2);
            return `
                <div class="entry-item">
                    <span class="entry-amount">+${formattedAmount} ${habit.trackingType === 'duration' ? 'mins' : habit.unit}</span>
                    <span class="entry-time">${entry.time}</span>
                    <button class="entry-delete" onclick="deleteEntry('${habitId}', ${index})" title="Delete entry">×</button>
                </div>
            `;
        }).join('');
    } else {
        entriesList.innerHTML = '<p style="color: var(--color-text-muted); font-size: 0.85rem;">No entries yet today</p>';
    }
}

// Add tracking entry
function addTrackingEntry(amount) {
    const habitId = document.getElementById('trackingHabitId').value;
    const habit = habits.find(h => h.id === habitId);
    const today = getTodayString();
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    const entry = {
        amount: amount,
        time: timeString,
        timestamp: now.toISOString()
    };
    
    habitCompletions[habitId][today].entries.push(entry);
    habitCompletions[habitId][today].value = (habitCompletions[habitId][today].value || 0) + amount;
    
    // Auto-complete if goal reached
    if (habitCompletions[habitId][today].value >= habit.dailyGoal) {
        habitCompletions[habitId][today].completed = true;
        
        if (adhdMode) {
            const messages = [
                'Goal crushed! 🎯',
                'You did it! Amazing! 🌟',
                'Fantastic work! 💪',
                'Keep going! You\'re on fire! 🔥'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            showCelebration(habit.icon + ' Goal Reached!', randomMessage);
        }
    }
    
    saveData();
    updateTrackingModal(habitId);
    renderHabits();
    updateStats();
}

// Delete entry
function deleteEntry(habitId, index) {
    const today = getTodayString();
    const completion = habitCompletions[habitId][today];
    const entry = completion.entries[index];
    
    completion.value -= entry.amount;
    completion.entries.splice(index, 1);
    
    if (completion.value < habits.find(h => h.id === habitId).dailyGoal) {
        completion.completed = false;
    }
    
    saveData();
    updateTrackingModal(habitId);
    renderHabits();
    updateStats();
}

// Toggle simple habit
function toggleHabit(habitId) {
    const today = getTodayString();
    
    if (!habitCompletions[habitId]) {
        habitCompletions[habitId] = {};
    }
    
    if (!habitCompletions[habitId][today]) {
        habitCompletions[habitId][today] = { completed: false, value: 0, entries: [] };
    }
    
    const wasCompleted = habitCompletions[habitId][today].completed;
    habitCompletions[habitId][today].completed = !wasCompleted;
    habitCompletions[habitId][today].value = !wasCompleted ? 1 : 0;
    
    if (!wasCompleted && adhdMode) {
        const habit = habits.find(h => h.id === habitId);
        const messages = [
            'Fantastic! Keep it up! 🌟',
            'You\'re crushing it! 💪',
            'One step closer! 🎯',
            'Amazing progress! ✨',
            'You did it! 🎉',
            'Great job! Keep going! 🚀'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        showCelebration(habit.icon + ' Complete!', randomMessage);
    }
    
    saveData();
    renderHabits();
    updateStats();
    renderWeeklyCalendar();
    renderMonthlyView();
}

// Delete habit
function deleteHabit(habitId) {
    const message = adhdMode 
        ? 'Taking a break from this habit? You can always add it back later!' 
        : 'Are you sure you want to delete this habit? All progress will be lost.';
    
    if (!confirm(message)) {
        return;
    }
    
    habits = habits.filter(h => h.id !== habitId);
    delete habitCompletions[habitId];
    
    saveData();
    renderHabits();
    updateStats();
    renderWeeklyCalendar();
    renderMonthlyView();
}

// Calculate current streak
function calculateStreak(habitId) {
    const completions = habitCompletions[habitId] || {};
    let streak = 0;
    let currentDate = new Date();
    
    const today = getTodayString();
    const todayCompletion = completions[today];
    if (!todayCompletion || !todayCompletion.completed) {
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    while (true) {
        const dateString = currentDate.toISOString().split('T')[0];
        const completion = completions[dateString];
        if (completion && completion.completed) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }
    
    return streak;
}

// Calculate longest streak
function calculateLongestStreak(habitId) {
    const completions = habitCompletions[habitId] || {};
    const dates = Object.keys(completions)
        .filter(date => completions[date].completed)
        .sort();
    
    if (dates.length === 0) return 0;
    
    let longestStreak = 1;
    let currentStreak = 1;
    
    for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]);
        const currDate = new Date(dates[i]);
        
        const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            currentStreak++;
            longestStreak = Math.max(longestStreak, currentStreak);
        } else {
            currentStreak = 1;
        }
    }
    
    return longestStreak;
}

// Update statistics
function updateStats() {
    const today = getTodayString();
    let completedToday = 0;
    let longestStreak = 0;
    
    habits.forEach(habit => {
        const completion = habitCompletions[habit.id]?.[today];
        if (completion && completion.completed) {
            completedToday++;
        }
        
        const streak = calculateLongestStreak(habit.id);
        if (streak > longestStreak) {
            longestStreak = streak;
        }
    });
    
    const totalHabits = habits.length;
    const todayProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    document.getElementById('todayProgress').textContent = `${todayProgress}%`;
    document.getElementById('totalHabits').textContent = totalHabits;
    document.getElementById('longestStreak').textContent = longestStreak;
}

// Render weekly calendar
function renderWeeklyCalendar() {
    const calendar = document.getElementById('weeklyCalendar');
    const today = new Date();
    const weekDays = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        weekDays.push(date);
    }
    
    calendar.innerHTML = weekDays.map(date => {
        const dateString = date.toISOString().split('T')[0];
        const isToday = dateString === getTodayString();
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const dayDate = date.getDate();
        
        let habitDots = '';
        habits.forEach(habit => {
            const completion = habitCompletions[habit.id]?.[dateString];
            const isCompleted = completion && completion.completed;
            habitDots += `<div class="habit-dot ${isCompleted ? 'completed' : ''}"></div>`;
        });
        
        return `
            <div class="day-column ${isToday ? 'today' : ''}">
                <div class="day-name">${dayName}</div>
                <div class="day-date">${dayDate}</div>
                <div class="day-habits">${habitDots}</div>
            </div>
        `;
    }).join('');
}

// Render monthly view
function renderMonthlyView() {
    const container = document.getElementById('monthlyView');
    const monthName = currentMonthView.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    document.getElementById('currentMonth').textContent = monthName;
    
    if (habits.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 2rem;">Create habits to see your monthly progress here!</p>';
        return;
    }
    
    container.innerHTML = habits.map(habit => {
        const stats = calculateMonthlyStats(habit.id, currentMonthView);
        const heatmapHTML = renderHeatmap(habit, currentMonthView);
        
        let totalDisplay = '';
        if (habit.trackingType === 'quantity') {
            totalDisplay = `${stats.totalValue} ${habit.unit}`;
        } else if (habit.trackingType === 'duration') {
            const hours = Math.floor(stats.totalValue / 60);
            const mins = stats.totalValue % 60;
            totalDisplay = hours > 0 ? `${hours}h ${mins}m` : `${mins} mins`;
        } else {
            totalDisplay = `${stats.completedDays} days`;
        }
        
        return `
            <div class="habit-monthly-card">
                <div class="habit-monthly-header">
                    <div class="habit-monthly-info">
                        <span class="habit-monthly-icon">${habit.icon}</span>
                        <span class="habit-monthly-name">${habit.name}</span>
                    </div>
                    <div class="habit-monthly-stats">
                        <div class="stat-item">
                            <span class="stat-value">${totalDisplay}</span>
                            <span class="stat-label">Total</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${stats.completionRate}%</span>
                            <span class="stat-label">Rate</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-value">${stats.currentStreak}</span>
                            <span class="stat-label">Streak</span>
                        </div>
                    </div>
                </div>
                ${heatmapHTML}
            </div>
        `;
    }).join('');
}

// Calculate monthly stats
function calculateMonthlyStats(habitId, monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const habit = habits.find(h => h.id === habitId);
    
    let completedDays = 0;
    let totalValue = 0;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const completion = habitCompletions[habitId]?.[dateString];
        
        if (completion) {
            if (completion.completed) completedDays++;
            totalValue += (completion.value || 0);
        }
    }
    
    const completionRate = Math.round((completedDays / daysInMonth) * 100);
    const currentStreak = calculateStreak(habitId);
    
    return {
        completedDays,
        totalValue,
        completionRate,
        currentStreak
    };
}

// Render heatmap
function renderHeatmap(habit, monthDate) {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    let html = '<div class="heatmap-container"><div class="heatmap-grid">';
    
    // Day labels
    dayLabels.forEach(label => {
        html += `<div class="heatmap-day-label">${label}</div>`;
    });
    
    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="heatmap-box empty"></div>';
    }
    
    // Days of the month
    const today = new Date();
    const todayString = getTodayString();
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = date.toISOString().split('T')[0];
        const completion = habitCompletions[habit.id]?.[dateString];
        const isToday = dateString === todayString;
        const isFuture = date > today;
        
        let intensity = 0;
        let tooltipText = '';
        
        if (isFuture) {
            html += `<div class="heatmap-box future"><span>${day}</span></div>`;
            continue;
        }
        
        if (completion) {
            if (habit.trackingType === 'simple') {
                intensity = completion.completed ? 100 : 0;
                tooltipText = completion.completed ? 'Completed' : 'Not done';
            } else {
                const percentage = (completion.value / habit.dailyGoal) * 100;
                intensity = Math.min(100, percentage);
                const unit = habit.trackingType === 'duration' ? 'mins' : habit.unit;
                tooltipText = `${completion.value}/${habit.dailyGoal} ${unit}`;
            }
        } else {
            intensity = 0;
            tooltipText = 'No data';
        }
        
        const color = habit.color || '#3b82f6';
        const bgColor = intensity === 0 ? 'var(--color-surface-light)' : adjustColorOpacity(color, intensity);
        
        html += `
            <div class="heatmap-box ${isToday ? 'today' : ''}" style="background: ${bgColor};">
                <span>${day}</span>
                <div class="heatmap-tooltip">${tooltipText}</div>
            </div>
        `;
    }
    
    html += '</div></div>';
    
    // Legend
    const color = habit.color || '#3b82f6';
    html += `
        <div class="heatmap-legend">
            <span class="legend-label">Less</span>
            <div class="legend-boxes">
                <div class="legend-box" style="background: var(--color-surface-light);"></div>
                <div class="legend-box" style="background: ${adjustColorOpacity(color, 25)};"></div>
                <div class="legend-box" style="background: ${adjustColorOpacity(color, 50)};"></div>
                <div class="legend-box" style="background: ${adjustColorOpacity(color, 75)};"></div>
                <div class="legend-box" style="background: ${adjustColorOpacity(color, 100)};"></div>
            </div>
            <span class="legend-label">More</span>
        </div>
    `;
    
    return html;
}

// Adjust color opacity
function adjustColorOpacity(hexColor, percentage) {
    // Convert hex to RGB
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    
    // Calculate opacity (0.2 to 1.0 based on percentage)
    const opacity = 0.2 + (percentage / 100) * 0.8;
    
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Get today's date string
function getTodayString() {
    return new Date().toISOString().split('T')[0];
}

// Show celebration
function showCelebration(title, message) {
    const overlay = document.getElementById('celebrationOverlay');
    const messageElement = document.getElementById('celebrationMessage');
    
    messageElement.textContent = message || title;
    overlay.style.display = 'flex';
    
    setTimeout(() => {
        overlay.style.display = 'none';
    }, 2000);
}

// Update notification status
function updateNotificationStatus() {
    const statusElement = document.getElementById('notificationStatus');
    const btnEnable = document.getElementById('btnEnableNotifications');
    
    if ('Notification' in window) {
        if (Notification.permission === 'granted') {
            statusElement.textContent = '✓ Enabled';
            statusElement.style.color = 'var(--color-success)';
            btnEnable.style.display = 'none';
        } else if (Notification.permission === 'denied') {
            statusElement.textContent = 'Blocked - Check browser settings';
            statusElement.style.color = '#ef4444';
            btnEnable.style.display = 'none';
        } else {
            statusElement.textContent = 'Click to enable';
            btnEnable.style.display = 'block';
        }
    } else {
        statusElement.textContent = 'Not supported in this browser';
        btnEnable.style.display = 'none';
    }
}

// PWA Install Prompt
let deferredPrompt;

function checkInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        setTimeout(() => {
            const installPrompt = document.getElementById('installPrompt');
            installPrompt.style.display = 'block';
        }, 10000);
    });
    
    document.getElementById('btnInstall').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        deferredPrompt = null;
        document.getElementById('installPrompt').style.display = 'none';
    });
    
    document.getElementById('btnCloseInstall').addEventListener('click', () => {
        document.getElementById('installPrompt').style.display = 'none';
    });
}

// Service Worker Registration
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}

// Export to CSV
function exportToCSV() {
    const includeHabits = document.getElementById('exportHabits').checked;
    const includeCompletions = document.getElementById('exportCompletions').checked;
    const includeStats = document.getElementById('exportStats').checked;
    
    let csvContent = '';
    
    // Export Habits
    if (includeHabits) {
        csvContent += '=== HABITS ===\n';
        csvContent += 'ID,Name,Icon,Category,Tracking Type,Unit,Daily Goal,Notes,Reminder Time,Created At\n';
        
        habits.forEach(habit => {
            const row = [
                habit.id,
                `"${habit.name}"`,
                habit.icon,
                habit.category || '',
                habit.trackingType || 'simple',
                habit.unit || '',
                habit.dailyGoal || '',
                `"${(habit.notes || '').replace(/"/g, '""')}"`,
                habit.reminderTime || '',
                habit.createdAt
            ].join(',');
            csvContent += row + '\n';
        });
        csvContent += '\n';
    }
    
    // Export Completion History
    if (includeCompletions) {
        csvContent += '=== COMPLETION HISTORY ===\n';
        csvContent += 'Habit ID,Habit Name,Date,Completed,Value,Entries Count\n';
        
        habits.forEach(habit => {
            const completions = habitCompletions[habit.id] || {};
            Object.keys(completions).sort().forEach(date => {
                const completion = completions[date];
                const row = [
                    habit.id,
                    `"${habit.name}"`,
                    date,
                    completion.completed ? 'Yes' : 'No',
                    completion.value || 0,
                    completion.entries ? completion.entries.length : 0
                ].join(',');
                csvContent += row + '\n';
            });
        });
        csvContent += '\n';
    }
    
    // Export Statistics
    if (includeStats) {
        csvContent += '=== STATISTICS ===\n';
        csvContent += 'Habit Name,Total Completions,Current Streak,Longest Streak,Completion Rate (Last 30 Days)\n';
        
        habits.forEach(habit => {
            const completions = habitCompletions[habit.id] || {};
            const totalCompletions = Object.values(completions).filter(c => c.completed).length;
            const currentStreak = calculateStreak(habit.id);
            const longestStreak = calculateLongestStreak(habit.id);
            
            // Calculate completion rate for last 30 days
            const last30Days = [];
            for (let i = 0; i < 30; i++) {
                const date = new Date();
                date.setDate(date.getDate() - i);
                const dateString = date.toISOString().split('T')[0];
                last30Days.push(dateString);
            }
            
            const completedLast30 = last30Days.filter(date => {
                const completion = completions[date];
                return completion && completion.completed;
            }).length;
            
            const completionRate = Math.round((completedLast30 / 30) * 100);
            
            const row = [
                `"${habit.name}"`,
                totalCompletions,
                currentStreak,
                longestStreak,
                completionRate + '%'
            ].join(',');
            csvContent += row + '\n';
        });
    }
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    const now = new Date();
    const filename = `HabitFlow_Export_${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}.csv`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    if (adhdMode) {
        showCelebration('📥 Export Complete!', 'Your data has been downloaded! 🎉');
    } else {
        alert('Data exported successfully!');
    }
}

/**
 * Main Application Entry Point
 * Phase 2A + 2B - Modular Architecture with State Management
 * 
 * This file orchestrates all modules and initializes the application
 */

// Import utilities
import { sanitizeHabitName, sanitizeNotes } from './utils/sanitizer.js';
import { Validator } from './utils/validator.js';
import { getTodayString } from './utils/dateHelpers.js';

// Import modules
import { AppState } from './modules/AppState.js';
import { StorageService } from './modules/StorageService.js';
import { NotificationService } from './modules/NotificationService.js';
import { ThemeManager } from './modules/ThemeManager.js';
import { HabitManager } from './modules/HabitManager.js';
import { StatsCalculator } from './modules/StatsCalculator.js';
import { UIRenderer } from './modules/UIRenderer.js';
import { ExportService } from './modules/ExportService.js';

// ============================================================================
// INITIALIZE SERVICES
// ============================================================================

// Create service instances
const appState = new AppState();
const notificationService = new NotificationService();
const storageService = new StorageService(notificationService);
const themeManager = new ThemeManager(storageService, notificationService);
const habitManager = new HabitManager(storageService, notificationService);
const statsCalculator = new StatsCalculator();
const uiRenderer = new UIRenderer(habitManager, statsCalculator);
const exportService = new ExportService(statsCalculator);

// Make appState globally accessible for debugging (optional)
window.appState = appState;

// ============================================================================
// LOAD DATA AND INITIALIZE APP
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Load data from storage
    const habits = storageService.loadHabits();
    const completions = storageService.loadCompletions();
    const settings = storageService.loadSettings();
    
    // Initialize state
    appState.setHabits(habits);
    appState.setCompletions(completions);
    appState.setSettings(settings);
    
    // Apply settings
    if (settings.adhdMode) {
        document.body.classList.add('adhd-mode');
    }
    
    if (settings.focusMode) {
        const banner = document.getElementById('focusModeBanner');
        if (banner) banner.style.display = 'flex';
    }
    
    // Initialize theme
    themeManager.initialize();
    
    // Initialize UI
    uiRenderer.initializeUI();
    setupEventHandlers();
    
    // Initial render
    render();
    
    // Check for PWA install prompt
    checkInstallPrompt();
});

// ============================================================================
// RENDER FUNCTION
// ============================================================================

function render() {
    const habits = appState.getHabits();
    const completions = appState.getCompletions();
    const settings = appState.getSettings();
    
    uiRenderer.renderHabits(habits, completions, settings);
    uiRenderer.updateStats(habits, completions);
    uiRenderer.renderWeeklyCalendar(habits, completions);
    uiRenderer.renderMonthlyView(habits, completions);
}

// ============================================================================
// SAVE DATA HELPER
// ============================================================================

function saveData() {
    storageService.saveHabits(appState.getHabits());
    storageService.saveCompletions(appState.getCompletions());
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function setupEventHandlers() {
    setupHabitFormHandlers();
    setupSettingsHandlers();
    setupThemeHandlers();
    setupModalHandlers();
    setupTrackingHandlers();
    setupExportHandlers();
    setupCalendarHandlers();
    setupHabitActionsHandlers();
}

// Habit Form Handlers
function setupHabitFormHandlers() {
    const btnNewHabit = document.getElementById('btnNewHabit');
    const btnSaveHabit = document.getElementById('btnSaveHabit');
    const btnCancelHabit = document.getElementById('btnCancelHabit');
    
    if (btnNewHabit) {
        btnNewHabit.addEventListener('click', () => {
            document.getElementById('addHabitForm').style.display = 'block';
            document.getElementById('habitName').focus();
            resetForm();
        });
    }
    
    if (btnSaveHabit) {
        btnSaveHabit.addEventListener('click', saveHabit);
    }
    
    if (btnCancelHabit) {
        btnCancelHabit.addEventListener('click', () => {
            document.getElementById('addHabitForm').style.display = 'none';
            resetForm();
        });
    }
    
    // Icon selection
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            document.getElementById('selectedIcon').value = btn.dataset.icon;
        });
    });
    
    // Tracking type selection
    document.querySelectorAll('.tracking-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tracking-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('selectedTrackingType').value = btn.dataset.type;
            
            // Show/hide options based on type
            document.getElementById('quantityOptions').style.display = 
                btn.dataset.type === 'quantity' ? 'block' : 'none';
            document.getElementById('durationOptions').style.display = 
                btn.dataset.type === 'duration' ? 'block' : 'none';
        });
    });
    
    // Color selection
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('selectedColor').value = btn.dataset.color;
        });
    });
}

// Settings Handlers
function setupSettingsHandlers() {
    const btnSettings = document.getElementById('btnSettings');
    const settingsModal = document.getElementById('settingsModal');
    const btnCloseSettings = document.getElementById('btnCloseSettings');
    
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            settingsModal.style.display = 'flex';
            document.getElementById('adhdModeToggle').checked = appState.isADHDMode();
            document.getElementById('focusModeToggle').checked = appState.isFocusMode();
        });
    }
    
    if (btnCloseSettings) {
        btnCloseSettings.addEventListener('click', () => {
            settingsModal.style.display = 'none';
        });
    }
    
    // ADHD Mode Toggle
    const adhdToggle = document.getElementById('adhdModeToggle');
    if (adhdToggle) {
        adhdToggle.addEventListener('change', (e) => {
            appState.setADHDMode(e.target.checked);
            storageService.saveSetting('adhd_mode', e.target.checked);
            
            if (e.target.checked) {
                document.body.classList.add('adhd-mode');
                showCelebration('🧠 ADHD Support Mode Activated!', 'You\'ve got this! 💪');
            } else {
                document.body.classList.remove('adhd-mode');
            }
            
            render();
        });
    }
    
    // Focus Mode Toggle
    const focusToggle = document.getElementById('focusModeToggle');
    if (focusToggle) {
        focusToggle.addEventListener('change', (e) => {
            appState.setFocusMode(e.target.checked);
            storageService.saveSetting('focus_mode', e.target.checked);
            
            const focusModeBanner = document.getElementById('focusModeBanner');
            if (focusModeBanner) {
                focusModeBanner.style.display = e.target.checked ? 'flex' : 'none';
            }
            
            render();
        });
    }
    
    // Exit Focus Mode
    const btnExitFocus = document.getElementById('btnExitFocus');
    if (btnExitFocus) {
        btnExitFocus.addEventListener('click', () => {
            appState.setFocusMode(false);
            storageService.saveSetting('focus_mode', false);
            document.getElementById('focusModeToggle').checked = false;
            document.getElementById('focusModeBanner').style.display = 'none';
            render();
        });
    }
}

// Theme Handlers
function setupThemeHandlers() {
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) {
        themeSelect.addEventListener('change', (e) => {
            const themeChanged = themeManager.applyTheme(e.target.value);
            
            if (themeChanged && appState.isADHDMode()) {
                showCelebration('🎨 Theme Changed!', 'Looking good! Try it out! ✨');
            }
        });
    }
}

// Modal Handlers
function setupModalHandlers() {
    const settingsModal = document.getElementById('settingsModal');
    const trackingModal = document.getElementById('trackingModal');
    const weekViewModal = document.getElementById('weekViewModal');
    const monthViewModal = document.getElementById('monthViewModal');
    
    // Close modals on backdrop click
    [settingsModal, trackingModal, weekViewModal, monthViewModal].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
    });
}

// Tracking Modal Handlers
function setupTrackingHandlers() {
    const btnCloseTracking = document.getElementById('btnCloseTracking');
    const btnAddEntry = document.getElementById('btnAddEntry');
    const trackingValue = document.getElementById('trackingValue');
    
    if (btnCloseTracking) {
        btnCloseTracking.addEventListener('click', () => {
            document.getElementById('trackingModal').style.display = 'none';
        });
    }
    
    if (btnAddEntry && trackingValue) {
        btnAddEntry.addEventListener('click', () => {
            const habitId = document.getElementById('trackingHabitId').value;
            const value = parseFloat(trackingValue.value);
            
            if (isNaN(value) || value <= 0) {
                notificationService.error('Please enter a valid amount');
                return;
            }
            
            const habits = appState.getHabits();
            const completions = appState.getCompletions();
            const habit = habits.find(h => h.id === habitId);
            
            if (!habit) return;
            
            // Validate tracking value
            const validation = Validator.trackingValue(value, habit);
            if (!validation.valid) {
                notificationService.error(validation.errors.join('. '));
                return;
            }
            
            const result = habitManager.addTrackingEntry(
                habitId, 
                value, 
                habits, 
                completions, 
                appState.isADHDMode()
            );
            
            if (result.success) {
                appState.setCompletions(completions);
                saveData();
                
                if (result.shouldCelebrate) {
                    showCelebration(
                        `${habit.icon} Goal Reached!`,
                        habitManager.getCelebrationMessage()
                    );
                }
                
                trackingValue.value = '';
                uiRenderer.updateTrackingModal(habitId, habits, completions);
                render();
            }
        });
    }
}

// Export Handlers
function setupExportHandlers() {
    const btnExportData = document.getElementById('btnExportData');
    if (btnExportData) {
        btnExportData.addEventListener('click', () => {
            const includeHabits = document.getElementById('exportHabits').checked;
            const includeCompletions = document.getElementById('exportCompletions').checked;
            const includeStats = document.getElementById('exportStats').checked;
            
            exportService.exportToCSV(
                appState.getHabits(),
                appState.getCompletions(),
                { includeHabits, includeCompletions, includeStats }
            );
            
            if (appState.isADHDMode()) {
                showCelebration('📥 Export Complete!', 'Your data has been downloaded! 🎉');
            } else {
                notificationService.success('Data exported successfully!');
            }
        });
    }
}

// Calendar Handlers
function setupCalendarHandlers() {
    const btnViewWeek = document.getElementById('btnViewWeek');
    const btnViewMonth = document.getElementById('btnViewMonth');
    const btnCloseWeek = document.getElementById('btnCloseWeek');
    const btnCloseMonth = document.getElementById('btnCloseMonth');
    const btnPrevMonth = document.getElementById('btnPrevMonth');
    const btnNextMonth = document.getElementById('btnNextMonth');
    
    if (btnViewWeek) {
        btnViewWeek.addEventListener('click', () => {
            document.getElementById('weekViewModal').style.display = 'flex';
        });
    }
    
    if (btnViewMonth) {
        btnViewMonth.addEventListener('click', () => {
            document.getElementById('monthViewModal').style.display = 'flex';
            render();
        });
    }
    
    if (btnCloseWeek) {
        btnCloseWeek.addEventListener('click', () => {
            document.getElementById('weekViewModal').style.display = 'none';
        });
    }
    
    if (btnCloseMonth) {
        btnCloseMonth.addEventListener('click', () => {
            document.getElementById('monthViewModal').style.display = 'none';
        });
    }
    
    if (btnPrevMonth) {
        btnPrevMonth.addEventListener('click', () => {
            uiRenderer.previousMonth();
            uiRenderer.renderMonthlyView(appState.getHabits(), appState.getCompletions());
        });
    }
    
    if (btnNextMonth) {
        btnNextMonth.addEventListener('click', () => {
            uiRenderer.nextMonth();
            uiRenderer.renderMonthlyView(appState.getHabits(), appState.getCompletions());
        });
    }
}

// Habit Actions Handlers (using event delegation)
function setupHabitActionsHandlers() {
    document.addEventListener('click', (e) => {
        // Toggle habit completion
        if (e.target.closest('.btn-toggle-habit')) {
            const habitId = e.target.closest('.btn-toggle-habit').dataset.habitId;
            toggleHabit(habitId);
        }
        
        // Open tracking modal
        if (e.target.closest('.btn-track-modal')) {
            const habitId = e.target.closest('.btn-track-modal').dataset.habitId;
            openTrackingModal(habitId);
        }
        
        // Edit habit
        if (e.target.closest('.btn-edit')) {
            const habitId = e.target.closest('.btn-edit').dataset.habitId;
            editHabit(habitId);
        }
        
        // Delete habit
        if (e.target.closest('.btn-delete')) {
            const habitId = e.target.closest('.btn-delete').dataset.habitId;
            deleteHabit(habitId);
        }
        
        // Delete tracking entry
        if (e.target.closest('.btn-delete-entry')) {
            const btn = e.target.closest('.btn-delete-entry');
            const habitId = btn.dataset.habitId;
            const entryIndex = parseInt(btn.dataset.entryIndex);
            deleteEntry(habitId, entryIndex);
        }
    });
}

// ============================================================================
// HABIT CRUD FUNCTIONS
// ============================================================================

function saveHabit() {
    const habitName = sanitizeHabitName(document.getElementById('habitName').value);
    const selectedIcon = document.getElementById('selectedIcon').value;
    const trackingType = document.getElementById('selectedTrackingType').value;
    const habitColor = document.getElementById('selectedColor').value;
    const habitNotes = sanitizeNotes(document.getElementById('habitNotes').value);
    const editingHabitId = document.getElementById('editingHabitId').value;
    
    let unit = null;
    let dailyGoal = null;
    
    if (trackingType === 'quantity') {
        unit = document.getElementById('quantityUnit').value;
        dailyGoal = parseInt(document.getElementById('quantityGoal').value) || null;
    } else if (trackingType === 'duration') {
        unit = 'minutes';
        dailyGoal = parseInt(document.getElementById('durationGoal').value) || 30;
    }
    
    const habitData = {
        name: habitName,
        icon: selectedIcon,
        trackingType: trackingType,
        unit: unit,
        dailyGoal: dailyGoal,
        color: habitColor,
        notes: habitNotes
    };
    
    // Validate
    const validation = Validator.habit(habitData);
    if (!validation.valid) {
        notificationService.error(validation.errors.join('. '));
        return;
    }
    
    const habits = appState.getHabits();
    const completions = appState.getCompletions();
    
    if (editingHabitId) {
        habitManager.updateHabit(editingHabitId, habitData, habits);
        notificationService.success('Habit updated!');
    } else {
        habitManager.createHabit(habitData, habits, completions);
        notificationService.success('Habit created!');
    }
    
    appState.setHabits(habits);
    appState.setCompletions(completions);
    saveData();
    render();
    
    document.getElementById('addHabitForm').style.display = 'none';
    resetForm();
}

function editHabit(habitId) {
    const habit = appState.getHabit(habitId);
    if (!habit) return;
    
    document.getElementById('habitName').value = habit.name;
    document.getElementById('selectedIcon').value = habit.icon;
    document.getElementById('editingHabitId').value = habitId;
    document.getElementById('habitNotes').value = habit.notes || '';
    
    // Set icon selection
    document.querySelectorAll('.icon-btn').forEach(btn => {
        btn.classList.remove('selected');
        if (btn.dataset.icon === habit.icon) {
            btn.classList.add('selected');
        }
    });
    
    // Set tracking type
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
    
    // Set color
    const habitColor = habit.color || '#3b82f6';
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.color === habitColor) {
            btn.classList.add('active');
        }
    });
    document.getElementById('selectedColor').value = habitColor;
    
    document.getElementById('addHabitForm').style.display = 'block';
    document.getElementById('habitName').focus();
}

function deleteHabit(habitId) {
    const message = appState.isADHDMode()
        ? 'Taking a break from this habit? You can always add it back later!'
        : 'Are you sure you want to delete this habit? All progress will be lost.';
    
    if (!confirm(message)) return;
    
    const habits = appState.getHabits();
    const completions = appState.getCompletions();
    
    habitManager.deleteHabit(habitId, habits, completions);
    appState.setHabits(habits);
    appState.setCompletions(completions);
    
    saveData();
    render();
}

function toggleHabit(habitId) {
    const habits = appState.getHabits();
    const completions = appState.getCompletions();
    
    const result = habitManager.toggleHabit(habitId, habits, completions, appState.isADHDMode());
    
    if (result.shouldCelebrate) {
        showCelebration(
            `${result.habit.icon} Complete!`,
            habitManager.getCelebrationMessage()
        );
    }
    
    appState.setCompletions(completions);
    saveData();
    render();
}

function openTrackingModal(habitId) {
    const habits = appState.getHabits();
    const completions = appState.getCompletions();
    const habit = habits.find(h => h.id === habitId);
    
    if (!habit) return;
    
    const today = getTodayString();
    if (!completions[habitId]) completions[habitId] = {};
    if (!completions[habitId][today]) {
        completions[habitId][today] = { completed: false, value: 0, entries: [] };
    }
    
    document.getElementById('trackingHabitId').value = habitId;
    document.getElementById('trackingHabitIcon').textContent = habit.icon;
    document.getElementById('trackingHabitName').textContent = habit.name;
    document.getElementById('trackingModalTitle').textContent = `Track ${habit.name}`;
    
    const unitDisplay = habit.trackingType === 'duration' ? 'minutes' : habit.unit;
    document.getElementById('trackingUnit').textContent = unitDisplay;
    document.getElementById('trackingGoalValue').textContent = habit.dailyGoal;
    
    uiRenderer.updateTrackingModal(habitId, habits, completions);
    document.getElementById('trackingModal').style.display = 'flex';
}

function deleteEntry(habitId, entryIndex) {
    const habits = appState.getHabits();
    const completions = appState.getCompletions();
    
    const success = habitManager.deleteTrackingEntry(habitId, entryIndex, habits, completions);
    
    if (success) {
        appState.setCompletions(completions);
        saveData();
        uiRenderer.updateTrackingModal(habitId, habits, completions);
        render();
    }
}

function resetForm() {
    document.getElementById('habitName').value = '';
    document.getElementById('selectedIcon').value = '';
    document.getElementById('editingHabitId').value = '';
    document.getElementById('habitNotes').value = '';
    document.getElementById('quantityUnit').value = 'cups';
    document.getElementById('quantityGoal').value = '';
    document.getElementById('durationGoal').value = '30';
    document.getElementById('selectedTrackingType').value = 'simple';
    
    document.querySelectorAll('.icon-btn').forEach(btn => btn.classList.remove('selected'));
    document.querySelectorAll('.tracking-type-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tracking-type-btn')[0]?.classList.add('active');
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById('quantityOptions').style.display = 'none';
    document.getElementById('durationOptions').style.display = 'none';
}

// ============================================================================
// CELEBRATION HELPER
// ============================================================================

function showCelebration(title, message) {
    // Simple celebration using notification service
    notificationService.success(`${title} ${message}`);
}

// ============================================================================
// PWA INSTALL PROMPT
// ============================================================================

function checkInstallPrompt() {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });
}

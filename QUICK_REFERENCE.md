# 📚 Habit Flow - Quick Reference Guide

> Fast lookup for common development tasks and API reference

---

## 🚀 Quick Commands

### Development
```bash
# Start local server
npx serve -l 8000
# OR
python -m http.server 8000

# Access app
http://localhost:8000

# Stop server
Ctrl + C
```

### Testing
```bash
npm test                    # Run all tests
npm run test:coverage       # Run with coverage report
npm run test:watch          # Watch mode for development
```

### Deployment
```bash
git add .
git commit -m "Your message"
git push                    # Auto-deploys to GitHub Pages
```

---

## 📂 File Quick Reference

### Main Files
| File | Purpose | Edit When |
|------|---------|-----------|
| `index.html` | App structure & modals | Adding UI elements |
| `styles.css` | All styling | Changing appearance |
| `js/main.js` | Event handlers & init | Adding interactions |
| `manifest.json` | PWA config | Changing app metadata |

### Key Modules
| Module | Purpose | Key Methods |
|--------|---------|-------------|
| **AppState.js** | State management | `getHabits()`, `setHabits()`, `subscribe()` |
| **HabitManager.js** | CRUD operations | `createHabit()`, `updateHabit()`, `deleteHabit()` |
| **StatsCalculator.js** | Statistics | `calculateStreak()`, `calculateCompletionRate()` |
| **UIRenderer.js** | DOM updates | `renderHabits()`, `renderWeekView()` |
| **StorageService.js** | Persistence | `saveHabits()`, `loadHabits()` |

---

## 🎨 Common Customizations

### Add New Icon
**File:** `index.html` (around line 45)
```html
<button type="button" class="icon-btn" data-icon="🎮">🎮</button>
```

### Add New Category
**File:** `index.html` (around line 120)
```html
<button type="button" class="category-btn" 
        data-category="gaming" 
        data-color="#9333ea">
  <span class="category-dot" style="background: #9333ea;"></span>
  Gaming
</button>
```

### Change Default Icon
**File:** `index.html` (line 89)
```html
<input type="hidden" id="selectedIcon" value="🎯">
```

### Modify Color Palette
**File:** `styles.css` (lines 1-20)
```css
:root {
  --color-primary: #f59e0b;    /* Accent color */
  --color-bg: #0f172a;         /* Background */
  --color-surface: #1e293b;    /* Cards */
}
```

---

## 🔧 API Reference

### AppState Module

```javascript
// Get data
appState.getHabits()           // Returns: Array<Habit>
appState.getCompletions()      // Returns: Object
appState.getSettings()         // Returns: Object

// Set data
appState.setHabits(habits)     // Notifies observers
appState.setCompletions(data)  // Notifies observers

// Subscribe to changes
const unsubscribe = appState.subscribe('habits', (habits) => {
  // Called when habits change
})
unsubscribe() // Stop listening
```

### HabitManager Module

```javascript
const habitManager = new HabitManager(appState)

// Create habit
habitManager.createHabit(habitData, habits, completions)
// habitData: { name, icon, trackingType, unit, dailyGoal, color, category, notes }

// Update habit
habitManager.updateHabit(habitId, updates, habits)

// Delete habit
habitManager.deleteHabit(habitId, habits)

// Toggle completion (simple habits)
habitManager.toggleHabit(habitId, dateString, habits, completions)

// Add tracking entry (quantity/duration)
habitManager.addTrackingEntry(habitId, value, dateString, habits, completions)
```

### StatsCalculator Module

```javascript
const stats = new StatsCalculator(appState)

// Calculate streaks
stats.calculateStreak(habitId, completions)              // Current streak
stats.calculateLongestStreak(habitId, completions)       // Best streak ever
stats.calculateCompletionRate(habitId, completions, 30)  // Last 30 days %

// Overall statistics
stats.calculateOverallStats(habits, completions)
// Returns: { totalHabits, completedToday, currentStreak, completionRate }
```

### StorageService Module

```javascript
const storage = new StorageService(notificationService)

// Load data
const habits = storage.loadHabits()           // Returns: Array<Habit>
const completions = storage.loadCompletions() // Returns: Object

// Save data
storage.saveHabits(habits)           // Saves to localStorage
storage.saveCompletions(completions) // Saves to localStorage
```

### UIRenderer Module

```javascript
const renderer = new UIRenderer(habitManager, stats, appState)

// Initialize UI
renderer.initializeUI()

// Render views
renderer.renderHabits(habits, completions)
renderer.renderWeekView(habits, completions)
renderer.renderMonthView(habits, completions)
```

---

## 📋 Data Structures

### Habit Object
```javascript
{
  id: "uuid-string",
  name: "Exercise",
  icon: "🏃",
  trackingType: "simple" | "quantity" | "duration",
  unit: "reps" | "minutes" | null,
  dailyGoal: 30 | null,
  color: "#3b82f6",
  category: "health" | "productivity" | null,
  notes: "Morning routine",
  createdAt: "2026-01-16T10:00:00.000Z"
}
```

### Completion Object
```javascript
{
  "habit-id": {
    "2026-01-16": {
      completed: true,
      value: 45,          // For quantity/duration tracking
      entries: [          // Multiple entries per day
        { value: 15, timestamp: "2026-01-16T08:00:00.000Z" },
        { value: 30, timestamp: "2026-01-16T18:00:00.000Z" }
      ]
    }
  }
}
```

---

## 🐛 Debugging

### Common Issues

**Icons not showing:**
```bash
# Check if emoji is in the icon selector
grep "your-emoji" index.html
```

**Habits not saving:**
```javascript
// Open browser console (F12)
localStorage.getItem('habits')  // Check if data exists
```

**Tests failing:**
```bash
# Clear test cache
npm run test -- --clearCache

# Run specific test file
npm test -- tests/modules/HabitManager.test.js
```

**Local server not working:**
```bash
# Try different port
npx serve -l 3000

# Check if port is in use
netstat -ano | findstr :8000  # Windows
lsof -i :8000                 # Mac/Linux
```

---

## 🎯 Code Patterns

### Adding a New Module

1. **Create module file:** `js/modules/YourModule.js`
```javascript
export class YourModule {
  constructor(dependencies) {
    this.dep = dependencies
  }
  
  yourMethod() {
    // Implementation
  }
}
```

2. **Import in main.js:**
```javascript
import { YourModule } from './modules/YourModule.js'
const yourModule = new YourModule(dependencies)
```

3. **Create test file:** `tests/modules/YourModule.test.js`
```javascript
import { describe, it, expect } from 'vitest'
import { YourModule } from '../../js/modules/YourModule.js'

describe('YourModule', () => {
  it('should do something', () => {
    const module = new YourModule()
    expect(module.yourMethod()).toBe(expected)
  })
})
```

### Adding Event Handler

**In main.js:**
```javascript
document.getElementById('yourButton').addEventListener('click', () => {
  // Your logic here
  const data = getData()
  processData(data)
  render()
})
```

### State Update Pattern

```javascript
// 1. Get current state
const habits = appState.getHabits()

// 2. Modify state
const updatedHabits = [...habits, newHabit]

// 3. Set new state (triggers observers)
appState.setHabits(updatedHabits)

// 4. Persist
storageService.saveHabits(updatedHabits)

// 5. Re-render (optional - observers may handle this)
render()
```

---

## 🔍 Search & Find

### Find Function Usage
```bash
# Find where a function is called
grep -rn "functionName" js/

# Find function definition
grep -rn "function functionName\|const functionName" js/
```

### Find Element by ID
```bash
# In HTML
grep -n "id=\"elementId\"" index.html

# In JavaScript
grep -rn "getElementById('elementId')" js/
```

### Find CSS Class
```bash
# Definition
grep -n "\.className" styles.css

# Usage in HTML
grep -n "class=\".*className" index.html
```

---

## ⚡ Performance Tips

### Optimize Rendering
- Use `requestAnimationFrame()` for animations
- Batch DOM updates
- Use event delegation for dynamic elements

### localStorage Best Practices
- Stringify once, parse once per session
- Implement debouncing for frequent saves
- Keep data structure flat when possible

### Testing Performance
```bash
# Measure test execution time
npm test -- --reporter=verbose

# Profile specific tests
npm test -- --reporter=default --coverage
```

---

## 📊 Git Workflow

### Feature Development
```bash
git checkout -b feature/your-feature
# Make changes
npm test                           # Ensure tests pass
git add .
git commit -m "Add: feature description"
git push origin feature/your-feature
```

### Bug Fix
```bash
git checkout -b fix/bug-description
# Fix the bug
npm test                           # Verify fix
git add .
git commit -m "Fix: bug description"
git push origin fix/bug-description
```

### Commit Message Convention
- `Add:` New feature
- `Fix:` Bug fix
- `Update:` Modify existing feature
- `Refactor:` Code restructure
- `Docs:` Documentation only
- `Test:` Add/update tests
- `Style:` Formatting, no code change

---

## 🔐 Security Notes

### Input Sanitization
All user input is sanitized via `sanitizer.js`:
- Habit names: Max 100 characters, HTML stripped
- Notes: Max 500 characters, HTML stripped
- No eval() or innerHTML usage

### Data Privacy
- All data stored locally (localStorage)
- No analytics or tracking
- No external API calls
- PWA works 100% offline

---

## 📱 Browser Support

### Minimum Requirements
- **Chrome/Edge:** Version 90+
- **Firefox:** Version 88+
- **Safari:** Version 14+
- **Mobile:** iOS 14+, Android 10+

### Required Features
- ES6 Modules
- localStorage API
- CSS Grid & Flexbox
- Service Workers (for PWA)

---

## 💡 Pro Tips

1. **Use browser DevTools:** F12 → Console for debugging
2. **Hard refresh:** Ctrl+Shift+R to clear cache
3. **Test locally first:** Always test before pushing
4. **Read error messages:** They usually tell you exactly what's wrong
5. **Check test coverage:** `npm run test:coverage` shows untested code
6. **Use meaningful commits:** Future you will thank you
7. **Document as you go:** Update docs when adding features

---

## 🆘 Getting Help

### Resources
- **Project Docs:** See README.md
- **Phase 2C Docs:** PHASE_2C_COMPLETE_DOCUMENTATION.md
- **Vitest Docs:** https://vitest.dev
- **MDN Web Docs:** https://developer.mozilla.org

### Troubleshooting Steps
1. Check browser console for errors
2. Verify file paths and imports
3. Clear localStorage and test fresh
4. Run tests to find issues
5. Check git history for recent changes

---

**Quick Reference v1.0**  
*Last Updated: January 16, 2026*

---

💡 **Tip:** Bookmark this page for quick access during development!

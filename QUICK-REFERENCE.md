# ⚡ Quick Reference - Habit Flow

**For:** Developers working on Habit Flow  
**Version:** 5.4.0  
**Last Updated:** January 2025

---

## 🎯 Project Overview

**Tech Stack:** Vanilla JavaScript ES6, CSS3, HTML5  
**Architecture:** Modular ES6 with separation of concerns  
**Testing:** Vitest with 100% coverage  
**Deployment:** GitHub Pages (automatic)

---

## 📁 File Structure Quick Map

```
Habit-Flow/
├── index.html              # Main entry point
├── css/
│   ├── styles.css         # Base + themes (2167 lines)
│   ├── phase3-ui.css      # Enhancements (3060 lines)
│   └── phase3-mobile.css  # Mobile responsive (180 lines)
├── modules/
│   ├── HabitManager.js    # CRUD (200 lines)
│   ├── StatsCalculator.js # Analytics (150 lines)
│   ├── UIRenderer.js      # Rendering (584 lines)
│   ├── EventHandlers.js   # Events (400 lines)
│   └── SettingsManager.js # Settings (180 lines)
└── utils/
    ├── dateHelpers.js     # Date utils (100 lines)
    └── storage.js         # Storage wrapper (50 lines)
```

---

## 🚀 Common Commands

### Development
```bash
# Serve locally
python -m http.server 3000
# OR
npx http-server -p 3000

# Run tests
npm test

# Watch tests
npm run test:watch

# Coverage
npm run test:coverage
```

### Git Workflow
```bash
# Status check
git status

# Stage changes
git add .

# Commit
git commit -m "feat: your feature description"

# Push (auto-deploys to GitHub Pages)
git push origin main
```

---

## 🏗️ Architecture Quick View

### Data Flow
```
User Action → EventHandlers → Manager (Habit/Settings)
                                ↓
                         StatsCalculator
                                ↓
                           UIRenderer
                                ↓
                              DOM
```

### Module Responsibilities

| Module | Purpose | Key Methods |
|--------|---------|-------------|
| HabitManager | Habit CRUD | `addHabit()`, `updateHabit()`, `deleteHabit()` |
| StatsCalculator | Analytics | `calculateStreak()`, `getWeeklyStats()` |
| UIRenderer | Display | `renderHabits()`, `renderMonthlyView()` |
| EventHandlers | Events | `setupEventListeners()` |
| SettingsManager | Config | `loadTheme()`, `exportData()` |

---

## 📊 Key Data Structures

### Habit Object
```javascript
{
    id: "habit_1234567890",
    name: "Drink Water",
    icon: "💧",
    trackingType: "quantity", // "simple" | "quantity" | "duration"
    unit: "glasses",           // For quantity tracking
    dailyGoal: 8,             // Target amount
    category: "Health",        // Optional
    categoryColor: "#10b981",  // Optional
    createdAt: "2025-01-25"
}
```

### Completion Object
```javascript
completions = {
    "habit_123": {
        "2025-01-25": {
            completed: true,
            value: 8,
            entries: [
                { timestamp: "2025-01-25T08:00:00Z", value: 2 },
                { timestamp: "2025-01-25T12:00:00Z", value: 3 },
                { timestamp: "2025-01-25T18:00:00Z", value: 3 }
            ],
            notes: "Felt great today!"
        }
    }
}
```

### Settings Object
```javascript
{
    theme: "light-ocean",
    focusMode: false,
    notifications: {
        enabled: true,
        defaultTime: "09:00"
    }
}
```

---

## 🎨 Theme System

### Available Themes
```javascript
const themes = [
    'dark',           // Original dark theme
    'light-ocean',    // Professional blue
    'light-serenity', // ADHD: Gentle
    'light-dawn',     // ADHD: Fresh
    'light-harmony',  // ADHD: Wellness
    'light-mist'      // ADHD: Calm
];
```

### Theme Application
```javascript
// Apply theme
document.body.className = themeName;

// Theme CSS variables are automatically applied
// Defined in: css/styles.css (lines 1850-1950)
```

### CSS Variables (Per Theme)
```css
--color-bg           /* Background */
--color-surface      /* Cards */
--color-text         /* Primary text */
--color-text-muted   /* Secondary text */
--color-primary      /* Accent color */
--color-success      /* Success state */
--color-border       /* Borders */
```

---

## 🔧 Common Development Tasks

### Add New Tracking Type
1. Update `trackingTypes` in HabitManager
2. Add UI in modal (index.html line ~200)
3. Update rendering logic in UIRenderer
4. Add tests in HabitManager.test.js

### Add New Theme
1. Define CSS variables in styles.css
2. Add option in theme selector (index.html line 424)
3. Test all UI components
4. Update SettingsManager if needed

### Add New Stat Card
1. Create calculation method in StatsCalculator
2. Add rendering in UIRenderer
3. Style in phase3-ui.css
4. Add tests

### Fix CSS Issue
1. Identify which file:
   - Base styles → `styles.css`
   - Enhancements → `phase3-ui.css`
   - Mobile → `phase3-mobile.css`
2. Find selector (use browser DevTools)
3. Apply fix with proper specificity
4. Test all 6 themes

---

## 🧪 Testing Quick Guide

### Run Specific Tests
```bash
# Single file
npm test HabitManager.test.js

# Single test case
npm test -- -t "should add habit"

# Watch mode
npm run test:watch
```

### Test Structure
```javascript
describe('HabitManager', () => {
    let manager;
    
    beforeEach(() => {
        localStorage.clear();
        manager = new HabitManager();
    });
    
    test('should add habit', () => {
        const habit = manager.addHabit({
            name: 'Test',
            icon: '✓',
            trackingType: 'simple'
        });
        expect(habit.id).toBeDefined();
    });
});
```

### Coverage Target
- **Minimum:** 90%
- **Current:** 100%
- **Files:** All modules in `/modules` and `/utils`

---

## 🐛 Debug Tools

### Browser Console Helpers
```javascript
// View all habits
JSON.parse(localStorage.getItem('habitFlow_habits'))

// View completions
JSON.parse(localStorage.getItem('habitFlow_completions'))

// Clear data
localStorage.clear()

// Test theme switching
const themes = ['dark', 'light-ocean', 'light-serenity'];
let i = 0;
setInterval(() => {
    document.body.className = themes[i++ % themes.length];
}, 2000);
```

### Performance Check
```javascript
// Measure render time
console.time('render');
uiRenderer.renderHabits(habits, completions);
console.timeEnd('render');
```

---

## 📝 Code Style Guide

### JavaScript
- **ES6 modules** - Use import/export
- **Const by default** - Only use let when reassignment needed
- **Arrow functions** - For callbacks and short functions
- **Template literals** - For string interpolation
- **Destructuring** - For cleaner parameter handling

```javascript
// Good
const { name, icon } = habit;
const habits = manager.getHabits();

// Avoid
var habits = manager.getHabits();
const name = habit.name;
const icon = habit.icon;
```

### CSS
- **BEM-like naming** - `.habit-card__title`
- **CSS variables** - Use theme variables
- **Mobile-first** - Base styles, then media queries
- **Specificity** - Keep low, use classes over IDs

```css
/* Good */
.habit-card {
    background: var(--color-surface);
}

/* Avoid */
#habitCard {
    background: #1a1f35;
}
```

### HTML
- **Semantic tags** - Use section, article, nav
- **Accessibility** - ARIA labels, alt text
- **Data attributes** - For JavaScript hooks

---

## 🔍 Common Issues & Solutions

### Issue: Tests failing after changes
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm test
```

### Issue: Styles not applying
**Solution:**
1. Check CSS file load order in index.html
2. Verify CSS specificity (use DevTools)
3. Hard refresh: Ctrl+Shift+R

### Issue: ES6 modules not loading
**Solution:**
- Must use HTTP server (not file://)
- Check `type="module"` in script tags
- Verify file paths are correct

### Issue: LocalStorage quota exceeded
**Solution:**
```javascript
// Export data first!
// Then clear old completions
const cutoffDate = '2024-01-01';
// ... implement cleanup logic
```

---

## 📐 CSS Specificity Rules

### Priority Order (Lowest to Highest)
1. Element selectors: `div { }`
2. Class selectors: `.class { }`
3. ID selectors: `#id { }`
4. Inline styles: `style="..."`
5. `!important` flag

### Current Specificity Strategy
- **Base:** Element + class selectors
- **Themes:** Body class + descendants
- **Overrides:** Use `!important` sparingly
- **Export section:** Inline styles (highest priority)

---

## 🚀 Performance Optimization

### Current Optimizations
- ✅ Debounced event handlers
- ✅ Minimal DOM manipulation
- ✅ CSS animations over JS
- ✅ Lazy loading for modals
- ✅ Service worker caching

### Benchmarks
- **Page Load:** < 1s
- **Habit Render:** < 100ms
- **Theme Switch:** < 50ms
- **Test Suite:** < 5s

---

## 📦 Build & Deploy

### Current Setup
- **No build step** - Pure vanilla JS
- **Auto-deploy** - Push to main → GitHub Pages
- **Manual deploy** - Copy files to any static host

### Future Build Options
- Vite for bundling
- CSS minification
- JS minification
- Image optimization

---

## 🎯 Phase 3 Tier 2 & 3 Planning

See [PHASE-3-PLANNING.md](./PHASE-3-PLANNING.md) for detailed next steps:
- Tier 2: Celebrations, templates, categories
- Tier 3: iOS app, sync, monetization

---

## 📞 Getting Help

1. **Check docs:** README.md, START-HERE.md
2. **Browse code:** Well-commented modules
3. **Run tests:** Verify your understanding
4. **Debug:** Use browser DevTools
5. **Review commits:** Git history for context

---

## 🔗 Quick Links

- **Live App:** https://sivagp-app.github.io/Habit-Flow/
- **Repo:** https://github.com/sivagp-app/Habit-Flow
- **Tests:** `/tests` directory
- **Docs:** `/docs` directory

---

**Last Updated:** January 25, 2025  
**Maintainer:** Siva  
**Status:** Production Ready - Phase 3 Complete

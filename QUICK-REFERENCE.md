# 📋 PHASE 2 QUICK REFERENCE

## Architecture at a Glance

**Before:** 1 file, 1,760 lines, 6+ globals  
**After:** 12 modules, ~200 lines each, 0 globals

---

## 🗂️ Module Map

### Utils (Foundation)
```
js/utils/
├── sanitizer.js       → XSS protection
├── validator.js       → Input validation  
└── dateHelpers.js     → Date operations
```

### Services (Infrastructure)
```
js/modules/
├── NotificationService.js  → User feedback
├── StorageService.js       → localStorage ops
├── ThemeManager.js         → Theme switching
└── AppState.js            → State container ⭐
```

### Business Logic (Core)
```
js/modules/
├── HabitManager.js      → Habit CRUD
├── StatsCalculator.js   → Stats & streaks
├── UIRenderer.js        → Display logic
└── ExportService.js     → CSV export
```

### Orchestrator (Entry)
```
js/
└── main.js  → Wires everything together
```

---

## 🎯 Key Concepts

### AppState (No More Globals!)
```javascript
// OLD (Phase 1):
let habits = [];  // ❌ Global
let habitCompletions = {};  // ❌ Global

// NEW (Phase 2):
appState.getHabits();  // ✅ Controlled
appState.setHabits([...]);  // ✅ Safe
```

### Module Pattern
```javascript
// Each module is self-contained
export class HabitManager {
    constructor(dependencies) {
        this.storage = dependencies.storage;
    }
    
    createHabit(data) { /* ... */ }
}
```

### Dependency Injection
```javascript
// Services receive dependencies
const habitManager = new HabitManager(
    storageService,
    notificationService
);
```

### Observer Pattern
```javascript
// Subscribe to state changes
appState.subscribe('habitsChanged', (habits) => {
    render();
});
```

---

## 📖 Common Tasks

### Task 1: Find habit creation code
```
Before: Search 1,760 lines
After: Open js/modules/HabitManager.js
→ Look for createHabit()
⏱️ 5 seconds vs 5 minutes
```

### Task 2: Add new stat calculation
```
Location: js/modules/StatsCalculator.js
Steps:
1. Add new method
2. Call from UIRenderer
3. Display in UI
⏱️ 30 minutes vs 2 hours
```

### Task 3: Change storage format
```
Location: js/modules/StorageService.js
Steps:
1. Update load/save methods
2. Test migration
3. Deploy
⏱️ 1 hour vs 4 hours
```

### Task 4: Add new theme
```
Location: js/modules/ThemeManager.js
Steps:
1. Add to themeDescriptions
2. Add CSS in styles.css
3. Test
⏱️ 30 minutes vs 2 hours
```

---

## 🔍 Debugging Guide

### Issue: Feature not working

**Step 1: Check console**
```javascript
F12 → Console
Look for errors
```

**Step 2: Check which module**
```javascript
// Habit creation → HabitManager
// Stats display → StatsCalculator  
// Theme switch → ThemeManager
// Data save → StorageService
```

**Step 3: Check that module**
```javascript
// Add console.log at start of function
console.log('createHabit called', data);
```

**Step 4: Check AppState**
```javascript
// In console:
appState.getSnapshot()
// Shows current state
```

---

## 🧪 Testing Commands

### Run verification test
```javascript
// Paste in console:
fetch('test.js').then(r => r.text()).then(eval);
```

### Check AppState
```javascript
// See current state:
appState.getSnapshot()

// Check habits:
appState.getHabits()

// Check settings:
appState.getSettings()
```

### Check loaded modules
```javascript
// Should be undefined (no globals):
typeof habits  // undefined ✅
typeof habitCompletions  // undefined ✅

// Should be defined:
typeof appState  // object ✅
```

---

## 📦 File Checklist

### Must have these files:
```
✅ index.html (updated script tag)
✅ js/main.js
✅ js/modules/AppState.js
✅ js/modules/StorageService.js
✅ js/modules/NotificationService.js
✅ js/modules/ThemeManager.js
✅ js/modules/HabitManager.js
✅ js/modules/StatsCalculator.js
✅ js/modules/UIRenderer.js
✅ js/modules/ExportService.js
✅ js/utils/sanitizer.js
✅ js/utils/validator.js
✅ js/utils/dateHelpers.js
```

### Also keep:
```
✅ app.js (backup for rollback)
✅ styles.css
✅ manifest.json
✅ service-worker.js
✅ icon-192.svg
```

---

## 🎯 Data Flow

### Create Habit Flow:
```
User clicks button
    ↓
main.js event handler
    ↓
Validates (validator.js)
    ↓
Sanitizes (sanitizer.js)
    ↓
HabitManager.createHabit()
    ↓
AppState.addHabit()
    ↓
StorageService.saveHabits()
    ↓
Observer triggers
    ↓
UIRenderer.renderHabits()
    ↓
User sees new habit ✅
```

### Toggle Habit Flow:
```
User clicks ○
    ↓
main.js event handler
    ↓
HabitManager.toggleHabit()
    ↓
AppState.setCompletions()
    ↓
StorageService.saveCompletions()
    ↓
Observer triggers
    ↓
UIRenderer.renderHabits()
    ↓
StatsCalculator.updateStats()
    ↓
User sees ✓ ✅
```

---

## 💡 Quick Fixes

### Issue: Blank page
```bash
1. Hard refresh (Ctrl+Shift+R) 3x
2. Check console for errors
3. Verify all files uploaded
4. Check script tag in index.html
5. Clear cache completely
```

### Issue: Features broken
```bash
1. Open console (F12)
2. Note specific error
3. Find related module
4. Check that module uploaded
5. Verify import paths
```

### Issue: Data missing
```bash
1. Check localStorage:
   localStorage.getItem('habits')
2. Data there? → Loading issue
3. Data gone? → Check different device
4. Still gone? → Check backups
```

---

## 🔄 Common Workflows

### Workflow: Add new module
```javascript
// 1. Create file
// js/modules/MyModule.js
export class MyModule {
    constructor(deps) { }
}

// 2. Import in main.js
import { MyModule } from './modules/MyModule.js';

// 3. Initialize
const myModule = new MyModule(dependencies);

// 4. Use it
myModule.myMethod();
```

### Workflow: Add new feature
```javascript
// 1. Identify which module
// Habit-related → HabitManager
// Display-related → UIRenderer
// Storage-related → StorageService

// 2. Add method to module
export class HabitManager {
    myNewFeature() {
        // Implementation
    }
}

// 3. Call from main.js
habitManager.myNewFeature();

// 4. Update UI if needed
uiRenderer.render();
```

---

## 📊 Performance Tips

### Keep modules focused
```javascript
// Good: Single purpose
class StorageService {
    save() { }
    load() { }
}

// Bad: Too many responsibilities
class MegaService {
    save() { }
    load() { }
    render() { }
    calculate() { }
    export() { }
}
```

### Use AppState for data
```javascript
// Good: Through AppState
const habits = appState.getHabits();

// Bad: Direct access (doesn't exist anymore)
const habits = window.habits;  // undefined!
```

### Let observers handle updates
```javascript
// Good: State change triggers observers
appState.setHabits(newHabits);
// Observers automatically render

// Bad: Manual render everywhere
setHabits(newHabits);
render();
updateStats();
updateCalendar();
```

---

## 🎯 Best Practices

### 1. Always use AppState
```javascript
✅ const habits = appState.getHabits();
❌ const habits = [...];  // Where from?
```

### 2. Inject dependencies
```javascript
✅ new HabitManager(storage, notifications);
❌ class HabitManager {
      constructor() {
          this.storage = new StorageService();
      }
   }
```

### 3. Keep modules small
```javascript
✅ 100-300 lines per module
❌ 1,000+ lines in one module
```

### 4. One export per file
```javascript
✅ export class HabitManager { }
❌ export class A { }
   export class B { }
   export class C { }
```

---

## 📞 Quick Help

### Can't find code?
```
1. Check module map above
2. Use file search (Ctrl+F)
3. Check main.js imports
```

### Module not loading?
```
1. Check file path
2. Check export/import syntax
3. Check console for errors
4. Verify file uploaded
```

### State not updating?
```
1. Use appState.setX() not direct modification
2. Check observers registered
3. Check console for errors
```

### Need rollback?
```
See ROLLBACK-GUIDE.md
30 seconds to restore Phase 1
```

---

## 🎓 Learning Resources

### Understanding the architecture:
- Read README.md
- Read PHASE-2-COMPLETE.md
- Explore module files
- Run test.js

### Making changes:
- Start with small changes
- Test locally first
- One module at a time
- Check console for errors

### Getting help:
- Check inline comments
- Read module documentation
- Review examples in code
- Test in console

---

## ✅ Success Checklist

**Phase 2 is working if:**
- [ ] Page loads
- [ ] test.js shows 8/8 passed
- [ ] No console errors
- [ ] Can create habit
- [ ] Can track habit
- [ ] Can switch theme
- [ ] Data persists
- [ ] Mobile works

**All checked? You're good!** ✅

---

## 🎯 Key Metrics

| Metric | Phase 1 | Phase 2 | Improvement |
|--------|---------|---------|-------------|
| Files | 1 | 12 | Organized |
| Lines/file | 1,760 | ~200 | Manageable |
| Globals | 6+ | 0 | Safe |
| Find code | 5 min | 5 sec | 60x faster |
| Add feature | 4 hrs | 1 hr | 4x faster |

---

## 💾 Quick Commands

```javascript
// Get state snapshot
appState.getSnapshot()

// Check habits
appState.getHabits()

// Check completions
appState.getCompletions()

// Check settings
appState.getSettings()

// Subscribe to changes
appState.subscribe('habitsChanged', callback)

// Run tests
fetch('test.js').then(r => r.text()).then(eval)
```

---

**🎯 This is your Phase 2 cheat sheet!**

Keep it handy for quick reference while working with the new architecture.

**Questions? Check:**
- README.md (overview)
- PHASE-2-COMPLETE.md (detailed)
- DEPLOYMENT-GUIDE.md (deployment)
- ROLLBACK-GUIDE.md (emergency)

**Happy coding!** 🚀

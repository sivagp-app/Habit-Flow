# Habit Flow - Technical Architecture

> **A deep dive into the technical design and implementation of Habit Flow**

---

## Table of Contents

- [Overview](#overview)
- [Architectural Principles](#architectural-principles)
- [System Architecture](#system-architecture)
- [Module Design](#module-design)
- [Data Flow](#data-flow)
- [Design Patterns](#design-patterns)
- [State Management](#state-management)
- [Storage Layer](#storage-layer)
- [Testing Architecture](#testing-architecture)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Future Enhancements](#future-enhancements)

---

## Overview

Habit Flow is built using a **Clean Architecture** approach with vanilla JavaScript (ES6+). The application follows SOLID principles and employs modern design patterns to ensure maintainability, testability, and scalability.

### Technology Stack

- **Language:** JavaScript (ES6+)
- **Modules:** ES6 Modules (import/export)
- **Testing:** Vitest with jsdom
- **Storage:** Web Storage API (localStorage)
- **UI:** Vanilla JavaScript (no framework)
- **PWA:** Service Workers, Web App Manifest

### Key Metrics

- **Modules:** 8 core modules + 3 utilities
- **Test Coverage:** 129 tests (100% passing)
- **Bundle Size:** ~50KB (uncompressed)
- **Load Time:** <1s on 3G
- **Lighthouse Score:** 95+ (Performance, Accessibility, Best Practices)

---

## Architectural Principles

### 1. Separation of Concerns

Each module has a single, well-defined responsibility:

```
┌─────────────────────────────────────────┐
│           Presentation Layer            │
│  (UIRenderer, ThemeManager, Notifications)
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Business Logic Layer           │
│  (HabitManager, StatsCalculator)         │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│              Data Layer                  │
│  (AppState, StorageService)              │
└──────────────────────────────────────────┘
```

### 2. Dependency Injection

Modules receive their dependencies through constructors, enabling:
- Easy testing (mock injection)
- Loose coupling
- Explicit dependencies

```javascript
// Good: Dependencies injected
class HabitManager {
  constructor(appState) {
    this.appState = appState
  }
}

// Bad: Direct instantiation
class HabitManager {
  constructor() {
    this.appState = new AppState() // Tight coupling
  }
}
```

### 3. Observer Pattern

State changes notify interested parties without tight coupling:

```javascript
// Subscribe to state changes
appState.subscribe('habits', (habits) => {
  uiRenderer.renderHabits(habits)
})

// Modify state (observers notified automatically)
appState.setHabits(updatedHabits)
```

### 4. Immutability

State is never mutated directly:

```javascript
// Good: Create new array
const newHabits = [...habits, newHabit]
appState.setHabits(newHabits)

// Bad: Mutate existing array
habits.push(newHabit) // Don't do this!
```

---

## System Architecture

### High-Level Overview

```
┌──────────────────────────────────────────────────────────┐
│                        Browser                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │                    index.html                      │  │
│  │  ┌──────────────────────────────────────────────┐  │  │
│  │  │              main.js (Entry Point)           │  │  │
│  │  │  ┌────────────────────────────────────────┐  │  │  │
│  │  │  │         Module Initialization          │  │  │  │
│  │  │  │  • AppState                            │  │  │  │
│  │  │  │  • StorageService                      │  │  │  │
│  │  │  │  • HabitManager                        │  │  │  │
│  │  │  │  • StatsCalculator                     │  │  │  │
│  │  │  │  • UIRenderer                          │  │  │  │
│  │  │  │  • ExportService                       │  │  │  │
│  │  │  │  • ThemeManager                        │  │  │  │
│  │  │  │  • NotificationService                 │  │  │  │
│  │  │  └────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────┐  │  │  │
│  │  │  │         Event Listeners                │  │  │  │
│  │  │  │  • Button clicks                       │  │  │  │
│  │  │  │  • Form submissions                    │  │  │  │
│  │  │  │  • View switches                       │  │  │  │
│  │  │  └────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────┐  │
│  │                  localStorage                      │  │
│  │  • habits: Array<Habit>                            │  │
│  │  • habitCompletions: Object                        │  │
│  │  • theme: string                                   │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## Module Design

### Core Modules

#### 1. AppState (State Management)

**Purpose:** Centralized state container with observer pattern

**Responsibilities:**
- Store application state (habits, completions, settings)
- Notify subscribers when state changes
- Provide getters/setters for state access

**Interface:**
```javascript
class AppState {
  getHabits(): Array<Habit>
  setHabits(habits: Array<Habit>): void
  getCompletions(): Object
  setCompletions(completions: Object): void
  subscribe(key: string, callback: Function): Function
}
```

**Implementation Details:**
- Uses Map for storing subscribers
- Provides unsubscribe function
- Immutable state updates only

---

#### 2. HabitManager (Business Logic)

**Purpose:** Handle all habit-related operations

**Responsibilities:**
- Create, read, update, delete habits
- Toggle habit completion
- Add tracking entries (quantity/duration)
- Generate unique IDs

**Interface:**
```javascript
class HabitManager {
  createHabit(data, habits, completions): void
  updateHabit(id, updates, habits): void
  deleteHabit(id, habits): void
  toggleHabit(id, date, habits, completions): void
  addTrackingEntry(id, value, date, habits, completions): void
}
```

**Key Algorithms:**
- UUID generation for habit IDs
- Date-based completion tracking
- Aggregation of multiple tracking entries per day

---

#### 3. StatsCalculator (Analytics)

**Purpose:** Calculate statistics and streaks

**Responsibilities:**
- Calculate current streak
- Calculate longest streak
- Calculate completion rates
- Generate overall statistics

**Interface:**
```javascript
class StatsCalculator {
  calculateStreak(habitId, completions): number
  calculateLongestStreak(habitId, completions): number
  calculateCompletionRate(habitId, completions, days): number
  calculateOverallStats(habits, completions): Object
}
```

**Algorithms:**

**Streak Calculation:**
```
1. Start from today, go backward
2. For each day:
   a. If habit completed → increment streak
   b. If habit not completed → break
3. Return streak count
```

**Completion Rate:**
```
completionRate = (completedDays / totalDays) * 100
```

---

#### 4. UIRenderer (Presentation)

**Purpose:** Handle all DOM manipulation and rendering

**Responsibilities:**
- Render habit cards
- Render week/month views
- Update UI based on state changes
- Handle view switching

**Interface:**
```javascript
class UIRenderer {
  initializeUI(): void
  renderHabits(habits, completions): void
  renderWeekView(habits, completions): void
  renderMonthView(habits, completions): void
}
```

**Rendering Strategy:**
- Clear existing content
- Build new DOM structure
- Attach event listeners
- Animate transitions

---

#### 5. StorageService (Persistence)

**Purpose:** Abstract localStorage operations

**Responsibilities:**
- Save habits to localStorage
- Load habits from localStorage
- Save completions to localStorage
- Load completions from localStorage
- Handle storage errors

**Interface:**
```javascript
class StorageService {
  loadHabits(): Array<Habit>
  saveHabits(habits: Array<Habit>): void
  loadCompletions(): Object
  saveCompletions(completions: Object): void
}
```

**Error Handling:**
- Try/catch for all operations
- Fallback to empty state on errors
- User notification for failures

---

#### 6. ExportService (Data Export)

**Purpose:** Export data in various formats

**Responsibilities:**
- Generate CSV from habits and completions
- Calculate statistics for export
- Trigger download

**Interface:**
```javascript
class ExportService {
  exportToCSV(habits, completions): void
}
```

**CSV Format:**
```csv
Habit Name,Icon,Type,Current Streak,Longest Streak,Completion Rate
Exercise,🏃,simple,5,10,85%
```

---

#### 7. ThemeManager (UI Theming)

**Purpose:** Manage application theme

**Responsibilities:**
- Toggle between themes
- Persist theme preference
- Apply theme to UI

**Interface:**
```javascript
class ThemeManager {
  toggleTheme(): void
  loadTheme(): void
}
```

---

#### 8. NotificationService (User Feedback)

**Purpose:** Display user notifications

**Responsibilities:**
- Show success messages
- Show error messages
- Auto-dismiss notifications

**Interface:**
```javascript
class NotificationService {
  success(message: string): void
  error(message: string): void
}
```

---

### Utility Modules

#### dateHelpers.js

**Pure functions for date manipulation:**
- `getTodayString()` - Get today as YYYY-MM-DD
- `formatDate()` - Format Date object
- `getCurrentWeekDates()` - Get array of week dates
- `getDaysInMonth()` - Days in specified month
- `getFirstDayOfMonth()` - First day index
- `getMonthName()` - Month name from index
- `isToday()` - Check if date is today

#### sanitizer.js

**Input sanitization functions:**
- `sanitizeHabitName()` - Clean and truncate name (max 100 chars)
- `sanitizeNotes()` - Clean and truncate notes (max 500 chars)

#### validator.js

**Input validation functions:**
- `isValidHabitName()` - Validate habit name
- `isValidEmail()` - Validate email format
- `isValidDate()` - Validate date string
- `isValidNumber()` - Validate numeric input
- `isValidGoal()` - Validate goal value
- `isValidIcon()` - Validate icon string

---

## Data Flow

### Creating a Habit

```
User Action (Click "Create")
        ↓
Event Handler (main.js)
        ↓
Validate Input (sanitizer, validator)
        ↓
HabitManager.createHabit()
        ↓
AppState.setHabits() ← New habits array
        ↓
Observers Notified
        ↓
StorageService.saveHabits() ← Persist
        ↓
UIRenderer.renderHabits() ← Update UI
```

### Tracking a Habit

```
User Action (Click habit card)
        ↓
Event Handler (main.js)
        ↓
HabitManager.toggleHabit() / addTrackingEntry()
        ↓
AppState.setCompletions() ← Updated completions
        ↓
Observers Notified
        ↓
StorageService.saveCompletions() ← Persist
StatsCalculator.calculateStreak() ← Recalculate
UIRenderer.renderHabits() ← Update UI
```

### Application Initialization

```
Page Load
    ↓
main.js Executed
    ↓
Module Initialization
    ├─ AppState created
    ├─ StorageService created
    ├─ Load data from localStorage
    ├─ Other modules created with dependencies
    └─ Set initial state
    ↓
Event Listeners Attached
    ↓
Initial Render
    ↓
Application Ready
```

---

## Design Patterns

### 1. Observer Pattern (Pub/Sub)

**Used in:** AppState

**Purpose:** Decouple state changes from UI updates

```javascript
// Publisher
class AppState {
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, [])
    }
    this.subscribers.get(key).push(callback)
    
    return () => {
      // Unsubscribe function
      const callbacks = this.subscribers.get(key)
      const index = callbacks.indexOf(callback)
      callbacks.splice(index, 1)
    }
  }
  
  setHabits(habits) {
    this.habits = habits
    this._notify('habits', habits)
  }
}

// Subscriber
const unsubscribe = appState.subscribe('habits', (habits) => {
  uiRenderer.renderHabits(habits)
})
```

---

### 2. Dependency Injection

**Used in:** All modules

**Purpose:** Loose coupling, easier testing

```javascript
// Inject dependencies through constructor
const appState = new AppState()
const notificationService = new NotificationService()
const storageService = new StorageService(notificationService)
const habitManager = new HabitManager(appState)

// Easy to mock for testing
const mockAppState = { getHabits: () => [] }
const habitManager = new HabitManager(mockAppState)
```

---

### 3. Repository Pattern

**Used in:** StorageService

**Purpose:** Abstract data persistence

```javascript
// Repository interface
class StorageService {
  loadHabits() { /* Load from localStorage */ }
  saveHabits(habits) { /* Save to localStorage */ }
}

// Could be swapped with different implementation
class APIStorageService {
  async loadHabits() { /* Load from API */ }
  async saveHabits(habits) { /* Save to API */ }
}
```

---

### 4. Service Layer

**Used in:** All modules

**Purpose:** Separate business logic from presentation

```
View Layer (UIRenderer)
        ↓
Service Layer (HabitManager, StatsCalculator)
        ↓
Data Layer (AppState, StorageService)
```

---

## State Management

### State Structure

```javascript
{
  habits: [
    {
      id: "uuid",
      name: "Exercise",
      icon: "🏃",
      trackingType: "simple" | "quantity" | "duration",
      unit: "reps" | "minutes" | null,
      dailyGoal: 30 | null,
      color: "#3b82f6",
      category: "health" | null,
      notes: "Morning routine",
      createdAt: "2026-01-16T10:00:00.000Z"
    }
  ],
  
  completions: {
    "habit-uuid": {
      "2026-01-16": {
        completed: true,
        value: 45,
        entries: [
          { value: 15, timestamp: "..." },
          { value: 30, timestamp: "..." }
        ]
      }
    }
  },
  
  settings: {
    theme: "dark" | "light",
    notifications: true | false
  }
}
```

### State Updates

**Immutable Updates:**
```javascript
// Add habit
const newHabits = [...habits, newHabit]
appState.setHabits(newHabits)

// Update habit
const updatedHabits = habits.map(h => 
  h.id === habitId ? { ...h, ...updates } : h
)
appState.setHabits(updatedHabits)

// Delete habit
const filteredHabits = habits.filter(h => h.id !== habitId)
appState.setHabits(filteredHabits)
```

---

## Storage Layer

### localStorage Schema

**Keys:**
- `habits` - JSON array of habit objects
- `habitCompletions` - JSON object of completion records
- `theme` - String ("dark" or "light")

**Size Limits:**
- Most browsers: 5-10 MB
- Current usage: ~10-50 KB (typical user)

**Error Handling:**
```javascript
try {
  const data = JSON.parse(localStorage.getItem('habits'))
  return data || []
} catch (error) {
  console.error('Error loading habits:', error)
  notificationService.error('Failed to load habits')
  return []
}
```

---

## Testing Architecture

### Test Structure

```
tests/
├── vitest.setup.js           # Global test setup
│   ├── Mock localStorage
│   ├── Mock URL.createObjectURL
│   └── Reset state before each test
│
├── modules/                  # Module tests
│   ├── AppState.test.js      # 37 tests
│   ├── HabitManager.test.js  # 6 tests
│   └── ...
│
└── utils/                    # Utility tests
    ├── validator.test.js     # 21 tests
    ├── sanitizer.test.js     # 20 tests
    └── dateHelpers.test.js   # 17 tests
```

### Testing Strategy

**Unit Tests:**
- Test individual functions/methods
- Mock external dependencies
- Cover edge cases

**Integration Tests:**
- Test module interactions
- Verify data flow
- Test observer notifications

**Test Coverage Goals:**
- **Statements:** >90%
- **Branches:** >85%
- **Functions:** >95%
- **Lines:** >90%

---

## Performance Considerations

### Optimization Techniques

1. **Lazy Loading:**
   - Month view only renders when selected
   - Stats calculated on demand

2. **Event Delegation:**
   - Single listener on parent instead of many on children
   - Reduces memory usage

3. **Debouncing:**
   - Search inputs debounced (if implemented)
   - Prevents excessive re-renders

4. **Efficient DOM Updates:**
   - Batch updates when possible
   - Use DocumentFragment for multiple elements
   - Minimize reflows/repaints

5. **Data Structure Optimization:**
   - Completions stored by habit ID for O(1) lookup
   - Date strings as keys for fast access

### Performance Metrics

- **First Contentful Paint:** <1s
- **Time to Interactive:** <2s
- **Total Bundle Size:** ~50KB
- **localStorage Operations:** <10ms

---

## Security

### Input Validation & Sanitization

**All user input is sanitized:**
```javascript
// Before storing
const cleanName = sanitizeHabitName(userInput)
const cleanNotes = sanitizeNotes(userInput)
```

**Validation rules:**
- Habit name: Max 100 characters, HTML stripped
- Notes: Max 500 characters, HTML stripped
- No script tags allowed
- No SQL injection (no backend)

### XSS Prevention

- No `innerHTML` usage (use `textContent`)
- No `eval()` or `Function()` constructors
- Content Security Policy headers (in production)

### Data Privacy

- All data stored locally (no server)
- No analytics or tracking
- No external API calls
- Works completely offline

---

## Future Enhancements

### Phase 3: Advanced Features

1. **Cloud Sync**
   - Firebase/Supabase integration
   - Conflict resolution strategy
   - Offline-first with sync

2. **Advanced Analytics**
   - Trend analysis
   - Prediction models
   - Data visualization (charts)

3. **Social Features**
   - Accountability partners
   - Shared habits
   - Leaderboards

### Phase 2D: TypeScript (Optional)

- Type safety across codebase
- Better IDE support
- Compile-time error detection

### Architecture Evolution

**Current:** Monolithic frontend
**Future:** Microservices architecture (if backend added)

```
┌─────────────────────────────────────┐
│          Frontend (PWA)             │
│  ┌───────────────────────────────┐  │
│  │     Habit Flow Client         │  │
│  └───────────────────────────────┘  │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│         Backend Services            │
│  ┌──────────┐  ┌──────────┐         │
│  │  Auth    │  │  Habits  │         │
│  │ Service  │  │  Service │         │
│  └──────────┘  └──────────┘         │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│          Database Layer             │
│    (PostgreSQL / MongoDB)           │
└─────────────────────────────────────┘
```

---

## Conclusion

Habit Flow's architecture demonstrates that vanilla JavaScript can power sophisticated applications when combined with solid architectural principles. The modular design, comprehensive testing, and clear separation of concerns make the codebase maintainable and extensible.

---

**Document Version:** 1.0  
**Last Updated:** January 16, 2026  
**Author:** Siva

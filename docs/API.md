# Habit Flow - API Reference

> Complete API documentation for all modules and utilities

---

## Table of Contents

- [Core Modules](#core-modules)
  - [AppState](#appstate)
  - [HabitManager](#habitmanager)
  - [StatsCalculator](#statscalculator)
  - [UIRenderer](#uirenderer)
  - [StorageService](#storageservice)
  - [ExportService](#exportservice)
  - [ThemeManager](#thememanager)
  - [NotificationService](#notificationservice)
- [Utilities](#utilities)
  - [dateHelpers](#datehelpers)
  - [sanitizer](#sanitizer)
  - [validator](#validator)
- [Data Types](#data-types)
- [Constants](#constants)

---

## Core Modules

### AppState

**Purpose:** Centralized state management with observer pattern

**Location:** `js/modules/AppState.js`

**Constructor:**
```javascript
const appState = new AppState()
```

#### Methods

##### `getHabits()`
Get current habits array

**Returns:** `Array<Habit>` - Array of habit objects

**Example:**
```javascript
const habits = appState.getHabits()
console.log(habits.length) // Number of habits
```

---

##### `setHabits(habits)`
Update habits and notify subscribers

**Parameters:**
- `habits` *(Array<Habit>)* - New habits array

**Returns:** `void`

**Example:**
```javascript
const newHabits = [...habits, newHabit]
appState.setHabits(newHabits)
// All subscribers notified automatically
```

---

##### `getCompletions()`
Get completion records

**Returns:** `Object` - Completion records by habit ID and date

**Example:**
```javascript
const completions = appState.getCompletions()
console.log(completions['habit-id']['2026-01-16'])
```

---

##### `setCompletions(completions)`
Update completions and notify subscribers

**Parameters:**
- `completions` *(Object)* - New completions object

**Returns:** `void`

**Example:**
```javascript
const updated = {
  ...completions,
  'habit-id': {
    ...completions['habit-id'],
    '2026-01-16': { completed: true }
  }
}
appState.setCompletions(updated)
```

---

##### `getSettings()`
Get user settings

**Returns:** `Object` - Settings object

---

##### `subscribe(key, callback)`
Subscribe to state changes

**Parameters:**
- `key` *(string)* - State key to watch ('habits', 'completions', 'settings')
- `callback` *(Function)* - Function called when state changes

**Returns:** `Function` - Unsubscribe function

**Example:**
```javascript
const unsubscribe = appState.subscribe('habits', (habits) => {
  console.log('Habits changed:', habits.length)
})

// Later, stop listening
unsubscribe()
```

---

### HabitManager

**Purpose:** Handle all habit CRUD operations

**Location:** `js/modules/HabitManager.js`

**Constructor:**
```javascript
const habitManager = new HabitManager(appState)
```

**Parameters:**
- `appState` *(AppState)* - AppState instance

#### Methods

##### `createHabit(habitData, habits, completions)`
Create a new habit

**Parameters:**
- `habitData` *(Object)* - Habit properties
  - `name` *(string)* - Habit name
  - `icon` *(string)* - Emoji icon
  - `trackingType` *(string)* - 'simple', 'quantity', or 'duration'
  - `unit` *(string|null)* - Unit for quantity/duration
  - `dailyGoal` *(number|null)* - Daily goal value
  - `color` *(string)* - Hex color code
  - `category` *(string|null)* - Category name
  - `notes` *(string)* - Optional notes
- `habits` *(Array<Habit>)* - Current habits array
- `completions` *(Object)* - Current completions

**Returns:** `void`

**Example:**
```javascript
const habitData = {
  name: 'Morning Exercise',
  icon: '🏃',
  trackingType: 'duration',
  unit: 'minutes',
  dailyGoal: 30,
  color: '#3b82f6',
  category: 'health',
  notes: 'Cardio workout'
}

habitManager.createHabit(habitData, habits, completions)
```

---

##### `updateHabit(habitId, updates, habits)`
Update an existing habit

**Parameters:**
- `habitId` *(string)* - Habit UUID
- `updates` *(Object)* - Properties to update
- `habits` *(Array<Habit>)* - Current habits array

**Returns:** `void`

**Example:**
```javascript
habitManager.updateHabit('habit-id', {
  name: 'Evening Exercise',
  dailyGoal: 45
}, habits)
```

---

##### `deleteHabit(habitId, habits)`
Delete a habit

**Parameters:**
- `habitId` *(string)* - Habit UUID
- `habits` *(Array<Habit>)* - Current habits array

**Returns:** `void`

**Example:**
```javascript
habitManager.deleteHabit('habit-id', habits)
```

---

##### `toggleHabit(habitId, dateString, habits, completions)`
Toggle habit completion for a date (simple tracking)

**Parameters:**
- `habitId` *(string)* - Habit UUID
- `dateString` *(string)* - Date in YYYY-MM-DD format
- `habits` *(Array<Habit>)* - Current habits array
- `completions` *(Object)* - Current completions

**Returns:** `void`

**Example:**
```javascript
habitManager.toggleHabit('habit-id', '2026-01-16', habits, completions)
```

---

##### `addTrackingEntry(habitId, value, dateString, habits, completions)`
Add a tracking entry (quantity/duration)

**Parameters:**
- `habitId` *(string)* - Habit UUID
- `value` *(number)* - Amount to add
- `dateString` *(string)* - Date in YYYY-MM-DD format
- `habits` *(Array<Habit>)* - Current habits array
- `completions` *(Object)* - Current completions

**Returns:** `Object` - Result with success status and message

**Example:**
```javascript
const result = habitManager.addTrackingEntry(
  'habit-id',
  15,
  '2026-01-16',
  habits,
  completions
)

if (result.success) {
  console.log(result.message) // "Added 15 minutes"
}
```

---

### StatsCalculator

**Purpose:** Calculate habit statistics and streaks

**Location:** `js/modules/StatsCalculator.js`

**Constructor:**
```javascript
const statsCalculator = new StatsCalculator(appState)
```

#### Methods

##### `calculateStreak(habitId, completions)`
Calculate current streak for a habit

**Parameters:**
- `habitId` *(string)* - Habit UUID
- `completions` *(Object)* - Completion records

**Returns:** `number` - Current streak count

**Example:**
```javascript
const streak = statsCalculator.calculateStreak('habit-id', completions)
console.log(`Current streak: ${streak} days`)
```

---

##### `calculateLongestStreak(habitId, completions)`
Calculate longest streak ever for a habit

**Parameters:**
- `habitId` *(string)* - Habit UUID
- `completions` *(Object)* - Completion records

**Returns:** `number` - Longest streak count

**Example:**
```javascript
const longest = statsCalculator.calculateLongestStreak('habit-id', completions)
console.log(`Best streak: ${longest} days`)
```

---

##### `calculateCompletionRate(habitOrId, completions, days)`
Calculate completion rate over specified period

**Parameters:**
- `habitOrId` *(Habit|string)* - Habit object or ID
- `completions` *(Object)* - Completion records
- `days` *(number)* - Number of days to analyze (default: 30)

**Returns:** `number` - Completion rate as percentage (0-100)

**Example:**
```javascript
const rate = statsCalculator.calculateCompletionRate(habit, completions, 7)
console.log(`Completion rate (7 days): ${rate.toFixed(1)}%`)
```

---

##### `calculateOverallStats(habits, completions)`
Calculate overall statistics across all habits

**Parameters:**
- `habits` *(Array<Habit>)* - All habits
- `completions` *(Object)* - Completion records

**Returns:** `Object` - Overall statistics
  - `totalHabits` *(number)* - Total number of habits
  - `completedToday` *(number)* - Habits completed today
  - `currentStreak` *(number)* - Average current streak
  - `completionRate` *(number)* - Overall completion rate

**Example:**
```javascript
const stats = statsCalculator.calculateOverallStats(habits, completions)
console.log(`${stats.completedToday}/${stats.totalHabits} completed today`)
```

---

### UIRenderer

**Purpose:** Handle all DOM manipulation and rendering

**Location:** `js/modules/UIRenderer.js`

**Constructor:**
```javascript
const uiRenderer = new UIRenderer(habitManager, statsCalculator, appState)
```

#### Methods

##### `initializeUI()`
Initialize UI and set up event listeners

**Returns:** `void`

---

##### `renderHabits(habits, completions)`
Render all habits in the current view

**Parameters:**
- `habits` *(Array<Habit>)* - Habits to render
- `completions` *(Object)* - Completion records

**Returns:** `void`

---

##### `renderWeekView(habits, completions)`
Render week calendar view

**Parameters:**
- `habits` *(Array<Habit>)* - Habits to display
- `completions` *(Object)* - Completion records

**Returns:** `void`

---

##### `renderMonthView(habits, completions)`
Render month calendar view

**Parameters:**
- `habits` *(Array<Habit>)* - Habits to display
- `completions` *(Object)* - Completion records

**Returns:** `void`

---

### StorageService

**Purpose:** Abstract localStorage operations

**Location:** `js/modules/StorageService.js`

**Constructor:**
```javascript
const storageService = new StorageService(notificationService)
```

#### Methods

##### `loadHabits()`
Load habits from localStorage

**Returns:** `Array<Habit>` - Habits array (empty if error)

**Example:**
```javascript
const habits = storageService.loadHabits()
```

---

##### `saveHabits(habits)`
Save habits to localStorage

**Parameters:**
- `habits` *(Array<Habit>)* - Habits to save

**Returns:** `void`

**Example:**
```javascript
storageService.saveHabits(habits)
```

---

##### `loadCompletions()`
Load completions from localStorage

**Returns:** `Object` - Completions object (empty if error)

---

##### `saveCompletions(completions)`
Save completions to localStorage

**Parameters:**
- `completions` *(Object)* - Completions to save

**Returns:** `void`

---

### ExportService

**Purpose:** Export data in various formats

**Location:** `js/modules/ExportService.js`

**Constructor:**
```javascript
const exportService = new ExportService(statsCalculator)
```

#### Methods

##### `exportToCSV(habits, completions)`
Export habits and stats to CSV file

**Parameters:**
- `habits` *(Array<Habit>)* - Habits to export
- `completions` *(Object)* - Completion records

**Returns:** `void` (triggers download)

**CSV Format:**
```csv
Habit Name,Icon,Type,Current Streak,Longest Streak,Completion Rate
Exercise,🏃,duration,5,10,85.7%
```

---

### ThemeManager

**Purpose:** Manage UI theme

**Location:** `js/modules/ThemeManager.js`

**Constructor:**
```javascript
const themeManager = new ThemeManager()
```

#### Methods

##### `loadTheme()`
Load saved theme from localStorage and apply

**Returns:** `void`

---

##### `toggleTheme()`
Toggle between light and dark themes

**Returns:** `void`

---

### NotificationService

**Purpose:** Display user notifications

**Location:** `js/modules/NotificationService.js`

**Constructor:**
```javascript
const notificationService = new NotificationService()
```

#### Methods

##### `success(message)`
Show success notification

**Parameters:**
- `message` *(string)* - Message to display

**Returns:** `void`

**Example:**
```javascript
notificationService.success('Habit created successfully!')
```

---

##### `error(message)`
Show error notification

**Parameters:**
- `message` *(string)* - Error message to display

**Returns:** `void`

**Example:**
```javascript
notificationService.error('Failed to save habit')
```

---

## Utilities

### dateHelpers

**Location:** `js/utils/dateHelpers.js`

#### Functions

##### `getTodayString()`
Get today's date as string

**Returns:** `string` - Date in YYYY-MM-DD format

**Example:**
```javascript
const today = getTodayString() // "2026-01-16"
```

---

##### `formatDate(date)`
Format date object to YYYY-MM-DD

**Parameters:**
- `date` *(Date|string)* - Date to format

**Returns:** `string` - Formatted date

**Example:**
```javascript
const formatted = formatDate(new Date()) // "2026-01-16"
```

---

##### `getDaysAgo(days)`
Get date N days ago

**Parameters:**
- `days` *(number)* - Number of days to go back

**Returns:** `string` - Date in YYYY-MM-DD format

**Example:**
```javascript
const lastWeek = getDaysAgo(7) // "2026-01-09"
```

---

##### `getStartOfWeek(date)`
Get start of week (Sunday)

**Parameters:**
- `date` *(Date)* - Optional date (default: today)

**Returns:** `Date` - Start of week

---

##### `getCurrentWeekDates()`
Get array of dates for current week

**Returns:** `Array<string>` - 7 dates (Sunday-Saturday)

**Example:**
```javascript
const week = getCurrentWeekDates()
// ["2026-01-12", "2026-01-13", ..., "2026-01-18"]
```

---

##### `getDaysInMonth(year, month)`
Get number of days in a month

**Parameters:**
- `year` *(number)* - Year
- `month` *(number)* - Month (0-11)

**Returns:** `number` - Days in month

**Example:**
```javascript
const days = getDaysInMonth(2026, 0) // 31 (January)
```

---

##### `getFirstDayOfMonth(year, month)`
Get first day of month

**Parameters:**
- `year` *(number)* - Year
- `month` *(number)* - Month (0-11)

**Returns:** `number` - Day of week (0=Sunday, 6=Saturday)

---

##### `parseDate(dateString)`
Parse YYYY-MM-DD string to Date

**Parameters:**
- `dateString` *(string)* - Date string

**Returns:** `Date` - Date object

---

##### `isToday(dateString)`
Check if date is today

**Parameters:**
- `dateString` *(string)* - Date in YYYY-MM-DD format

**Returns:** `boolean` - True if today

**Example:**
```javascript
if (isToday('2026-01-16')) {
  console.log('This is today!')
}
```

---

##### `getMonthName(monthIndex)`
Get month name from index

**Parameters:**
- `monthIndex` *(number)* - Month index (0-11)

**Returns:** `string` - Month name

**Example:**
```javascript
const name = getMonthName(0) // "January"
```

---

##### `getDayName(dayIndex)`
Get day name from index

**Parameters:**
- `dayIndex` *(number)* - Day index (0-6)

**Returns:** `string` - Day name

**Example:**
```javascript
const name = getDayName(0) // "Sunday"
```

---

### sanitizer

**Location:** `js/utils/sanitizer.js`

#### Functions

##### `sanitizeHabitName(name)`
Sanitize and truncate habit name

**Parameters:**
- `name` *(string)* - Raw habit name

**Returns:** `string` - Sanitized name (max 100 chars)

**Example:**
```javascript
const clean = sanitizeHabitName('  Exercise  ') // "Exercise"
```

---

##### `sanitizeNotes(notes)`
Sanitize and truncate notes

**Parameters:**
- `notes` *(string)* - Raw notes

**Returns:** `string` - Sanitized notes (max 500 chars)

---

### validator

**Location:** `js/utils/validator.js`

#### Functions

##### `isValidHabitName(name)`
Validate habit name

**Parameters:**
- `name` *(string)* - Habit name to validate

**Returns:** `boolean` - True if valid

**Example:**
```javascript
if (isValidHabitName(name)) {
  // Create habit
}
```

---

##### `isValidEmail(email)`
Validate email format

**Parameters:**
- `email` *(string)* - Email to validate

**Returns:** `boolean` - True if valid format

---

##### `isValidDate(dateStr)`
Validate date string format

**Parameters:**
- `dateStr` *(string)* - Date string

**Returns:** `boolean` - True if valid YYYY-MM-DD

---

##### `isValidNumber(value)`
Validate if value is a number

**Parameters:**
- `value` *(any)* - Value to check

**Returns:** `boolean` - True if valid number

---

##### `isValidGoal(goal)`
Validate goal value

**Parameters:**
- `goal` *(number)* - Goal value

**Returns:** `boolean` - True if valid (positive, <= 1000)

---

##### `isValidIcon(icon)`
Validate icon string

**Parameters:**
- `icon` *(string)* - Icon to validate

**Returns:** `boolean` - True if valid (non-empty, <= 10 chars)

---

## Data Types

### Habit

```typescript
interface Habit {
  id: string              // UUID
  name: string            // Habit name (max 100 chars)
  icon: string            // Emoji icon
  trackingType: 'simple' | 'quantity' | 'duration'
  unit: string | null     // Unit for tracking (e.g., "reps", "minutes")
  dailyGoal: number | null // Target value per day
  color: string           // Hex color code
  category: string | null // Category name
  notes: string           // Optional notes (max 500 chars)
  createdAt: string       // ISO timestamp
}
```

### Completion

```typescript
interface Completions {
  [habitId: string]: {
    [date: string]: {      // YYYY-MM-DD format
      completed: boolean
      value?: number       // For quantity/duration
      entries?: Entry[]    // Multiple entries per day
    }
  }
}

interface Entry {
  value: number
  timestamp: string        // ISO timestamp
}
```

---

## Constants

### Tracking Types

```javascript
const TRACKING_TYPES = {
  SIMPLE: 'simple',
  QUANTITY: 'quantity',
  DURATION: 'duration'
}
```

### Storage Keys

```javascript
const STORAGE_KEYS = {
  HABITS: 'habits',
  COMPLETIONS: 'habitCompletions',
  THEME: 'theme'
}
```

### Limits

```javascript
const LIMITS = {
  HABIT_NAME_MAX: 100,
  NOTES_MAX: 500,
  ICON_MAX: 10,
  GOAL_MAX: 1000
}
```

---

**API Version:** 5.3.0  
**Last Updated:** January 16, 2026

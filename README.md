# 🎯 Habit Flow

> **Build momentum, one day at a time**

A modern, feature-rich Progressive Web App for building and tracking daily habits. Built with vanilla JavaScript using clean architecture principles and comprehensive testing.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://sivagp-app.github.io/Habit-Flow/)
[![Tests](https://img.shields.io/badge/tests-129%2F129-success)](./tests)
[![Version](https://img.shields.io/badge/version-5.3.0-blue)](./package.json)
[![License](https://img.shields.io/badge/license-MIT-green)]()

---

## ✨ Features

### Core Functionality
- 📊 **Multiple Tracking Types** - Simple completion, quantity tracking, or duration tracking
- 🔥 **Streak Tracking** - Monitor current and longest streaks for each habit
- 📅 **Week & Month Views** - Visualize your progress across different timeframes
- 🎨 **Customizable Habits** - Choose from multiple icons, colors, and categories
- 💾 **Auto-Save** - All data stored locally in your browser
- 📤 **Export Data** - Download your habits and stats as CSV

### User Experience
- ⚡ **Fast & Responsive** - Instant load times, smooth animations
- 🌓 **Dark Theme** - Easy on the eyes with modern dark UI
- 📱 **Mobile-First** - Works perfectly on phones, tablets, and desktop
- 🔒 **Privacy-Focused** - All data stays on your device
- ⚙️ **Configurable** - Customize tracking types, goals, and reminders
- 🎯 **Category Organization** - Group habits by Health, Productivity, Learning, etc.

### Technical Excellence
- 🏗️ **Modular Architecture** - Clean ES6 modules with dependency injection
- 🧪 **Comprehensive Testing** - 129 tests covering all functionality
- 🔄 **State Management** - Centralized state with observer pattern
- 🎨 **Modern Stack** - Vanilla JavaScript, no framework bloat
- 📦 **PWA Ready** - Installable, works offline

---

## 🚀 Quick Start

### Try It Now
👉 **[Open Habit Flow](https://sivagp-app.github.io/Habit-Flow/)** 👈

### Install as App
1. Visit the live site on your phone or desktop
2. Look for "Install App" or "Add to Home Screen"
3. Enjoy the native app experience!

### Local Development
```bash
# Clone the repository
git clone https://github.com/sivagp-app/Habit-Flow.git
cd Habit-Flow

# Install dependencies
npm install

# Start local server
npx serve
# OR
python -m http.server 8000

# Open browser
# Navigate to http://localhost:8000
```

---

## 📖 Usage Guide

### Creating Your First Habit

1. **Click "+ New Habit"**
2. **Enter a name** (e.g., "Morning Exercise")
3. **Select an icon** 🏃 (optional, defaults to 🎯)
4. **Choose tracking type:**
   - **Simple** - Just mark complete/incomplete
   - **Quantity** - Track amounts (glasses of water, pages read)
   - **Duration** - Track time spent (minutes exercising)
5. **Pick a category** (Health, Productivity, etc.)
6. **Click "Create Habit"**

### Tracking Your Habits

**Simple Habits:**
- Click the ⭕ circle to mark complete
- Turns to ✅ when done

**Quantity/Duration Habits:**
- Click the habit card
- Use quick-add buttons (+1, +5, +10) or enter custom value
- Track your daily progress toward goals

### Viewing Your Progress

- **Today's View** - See all habits for today
- **Week View** - Calendar grid showing 7-day streak
- **Month View** - Full month calendar with completion patterns
- **Stats** - Current streak, longest streak, completion rate

---

## 🏗️ Architecture

### Project Structure

```
Habit-Flow/
├── index.html              # Main app entry point
├── styles.css              # Complete styling (dark theme)
├── manifest.json           # PWA configuration
├── service-worker.js       # Offline support
│
├── js/
│   ├── main.js             # App initialization & event handlers
│   │
│   ├── modules/            # ES6 Modules (Clean Architecture)
│   │   ├── AppState.js           # Centralized state management
│   │   ├── HabitManager.js       # CRUD operations for habits
│   │   ├── StatsCalculator.js    # Streak & statistics logic
│   │   ├── UIRenderer.js         # DOM rendering & updates
│   │   ├── StorageService.js     # localStorage persistence
│   │   ├── ExportService.js      # CSV export functionality
│   │   ├── ThemeManager.js       # Theme switching
│   │   └── NotificationService.js # User notifications
│   │
│   └── utils/              # Utility Functions
│       ├── dateHelpers.js        # Date manipulation (11 functions)
│       ├── sanitizer.js          # Input sanitization
│       └── validator.js          # Input validation
│
└── tests/                  # Comprehensive Test Suite
    ├── vitest.setup.js           # Test environment configuration
    ├── modules/                  # Module tests (85 tests)
    └── utils/                    # Utility tests (44 tests)
```

### Design Patterns

- **Observer Pattern** - State changes notify subscribers
- **Dependency Injection** - Modules receive dependencies via constructor
- **Repository Pattern** - StorageService abstracts data persistence
- **Service Layer** - Business logic separated from UI
- **Single Responsibility** - Each module has one clear purpose

### Tech Stack

- **Frontend:** Vanilla JavaScript (ES6+)
- **Storage:** localStorage API
- **Testing:** Vitest with jsdom
- **Styling:** Custom CSS (CSS Grid, Flexbox)
- **PWA:** Service Worker, Web Manifest
- **Icons:** Emoji (no external dependencies)

---

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode (during development)
npm run test:watch
```

### Test Coverage
- **129 tests** covering all functionality
- **State Management:** 37 tests
- **Business Logic:** 19 tests
- **Validation:** 21 tests
- **Security:** 20 tests
- **Date Operations:** 17 tests
- **Storage:** 8 tests
- **UI Rendering:** 3 tests
- **Services:** 7 tests

### Coverage Reports
After running `npm run test:coverage`, open `coverage/index.html` to see detailed line-by-line coverage.

---

## 🔧 Configuration

### Customize Tracking Types

Edit `js/main.js` to add new tracking types:
```javascript
// Add custom tracking type
const trackingTypes = {
  'custom': {
    unit: 'your-unit',
    defaultGoal: 10
  }
};
```

### Add More Icons

Edit `index.html` to add icon options:
```html
<button type="button" class="icon-btn" data-icon="🎮">🎮</button>
```

### Modify Categories

Edit `index.html` to change category options:
```html
<button type="button" class="category-btn" 
        data-category="custom" 
        data-color="#ff5733">
  <span class="category-dot" style="background: #ff5733;"></span>
  Custom Category
</button>
```

---

## 📊 Data Management

### Data Storage
All data is stored in browser's localStorage:
- **habits** - Array of habit objects
- **habitCompletions** - Completion records by date
- **theme** - User's theme preference

### Export Data
Click the export button (⬇️) in settings to download your data as CSV with:
- Habit names and details
- Completion statistics
- Current and longest streaks
- Completion rates

### Import Data
Currently manual - copy data from CSV back into the app by recreating habits.
*Automated import feature planned for Phase 3.*

---

## 🗺️ Roadmap

### ✅ Completed Phases

- **Phase 1:** Monolithic App - Initial working version
- **Phase 2A:** Modular Architecture - ES6 modules with clean architecture
- **Phase 2B:** State Management - Centralized state with observer pattern
- **Phase 2C:** Testing Infrastructure - 129 tests with Vitest

### 🔜 Upcoming Features (Phase 3)

**High Priority:**
- 📈 Analytics dashboard with trends and insights
- 🎯 Habit goals and milestone tracking
- 🔄 Recurring habit patterns (weekdays only, etc.)
- 💾 Improved data export (JSON backup/restore)

**Medium Priority:**
- 🔔 Push notifications for reminders
- 🌓 Auto dark/light theme based on time
- 📋 Multiple view modes (grid, list, compact)
- 📝 Habit templates for quick setup

**Low Priority:**
- 🏆 Achievement badges and rewards
- 📊 Advanced statistics and charts
- 🤝 Social features (optional accountability partners)
- ☁️ Cloud sync (requires backend)

### 🔍 Phase 2D (Optional)
- TypeScript migration for type safety
- Enhanced IDE support
- Compile-time error detection

---

## 🤝 Contributing

This is a personal project, but suggestions and feedback are welcome!

### Reporting Issues
If you find a bug or have a feature request:
1. Check existing issues first
2. Create a new issue with clear description
3. Include steps to reproduce (for bugs)

### Development Setup
```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/Habit-Flow.git
cd Habit-Flow

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and test
npm test

# Commit with clear message
git commit -m "Add: your feature description"

# Push and create pull request
git push origin feature/your-feature-name
```

---

## 📝 License

MIT License - feel free to use this project for learning or personal use.

---

## 🙏 Acknowledgments

- **Design Inspiration:** Modern habit tracking apps
- **Icons:** Emoji (Unicode Standard)
- **Testing Framework:** Vitest by Anthony Fu
- **Development:** Built with dedication to clean code and UX

---

## 📧 Contact

**Developer:** Siva  
**Project Link:** [https://github.com/sivagp-app/Habit-Flow](https://github.com/sivagp-app/Habit-Flow)  
**Live Demo:** [https://sivagp-app.github.io/Habit-Flow/](https://sivagp-app.github.io/Habit-Flow/)

---

## 🌟 Star This Project

If you find Habit Flow useful, please consider giving it a star! ⭐

---

**Built with ❤️ and JavaScript**

*Last Updated: January 16, 2026*

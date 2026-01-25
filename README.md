# 🎯 Habit Flow - Professional Habit Tracking PWA

**Version:** 5.4.0  
**Status:** Production Ready  
**Last Updated:** January 2025

A sophisticated Progressive Web App for habit tracking with ADHD-optimized features, comprehensive analytics, and beautiful themes.

---

## ✨ Features

### Core Functionality
- ✅ **Simple & Advanced Tracking** - One-tap completion or quantity/duration tracking
- 📊 **Comprehensive Analytics** - Streaks, completion rates, and detailed statistics
- 📅 **Multiple Views** - Daily cards, weekly grid, and monthly heatmap
- 📝 **Habit Notes** - Add context to each completion
- ⏰ **Smart Reminders** - Time-based notifications for habits
- 💾 **Data Export** - CSV export with customizable options

### Design & Themes
- 🎨 **6 Beautiful Themes** - Dark mode + 5 light themes (including 4 ADHD-optimized)
- 📱 **Fully Responsive** - Perfect on mobile, tablet, and desktop
- 🎭 **ADHD-Optimized UI** - High contrast, reduced distractions, clear feedback
- ✨ **Smooth Animations** - Polished micro-interactions and transitions

### Technical Excellence
- 📦 **Modular Architecture** - ES6 modules with clear separation of concerns
- 🧪 **100% Test Coverage** - Comprehensive Vitest test suite
- 🔄 **Offline Support** - Service worker for offline functionality
- 📲 **Installable PWA** - Add to home screen on any device
- 🚀 **Performance Optimized** - Fast load times, efficient rendering

---

## 🚀 Quick Start

### Option 1: Visit Live Site (Easiest)
```
https://sivagp-app.github.io/Habit-Flow/
```

### Option 2: Run Locally
```bash
# Clone repository
git clone https://github.com/sivagp-app/Habit-Flow.git
cd Habit-Flow

# Serve with any HTTP server (required for ES6 modules)
# Option A: Python
python -m http.server 3000

# Option B: Node.js http-server
npx http-server -p 3000

# Option C: VS Code Live Server extension

# Open browser
http://localhost:3000
```

### Option 3: Install as App
1. Visit the live site on mobile or desktop
2. Look for "Install" or "Add to Home Screen" prompt
3. Install for native app-like experience

---

## 📖 Documentation

- **[START-HERE.md](./START-HERE.md)** - Complete beginner's guide
- **[QUICK-REFERENCE.md](./QUICK-REFERENCE.md)** - Fast reference for developers
- **[API-DOCS.md](./docs/API-DOCS.md)** - Developer API documentation
- **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Technical architecture guide

---

## 🎨 Themes

### Dark Theme
- **Original** - Professional dark mode with amber accents

### Light Themes
1. **Ocean Blue** - Professional and focused
2. **Serenity** - Gentle and soothing (ADHD-optimized)
3. **Dawn** - Fresh start energy (ADHD-optimized)
4. **Harmony** - Wellness focus (ADHD-optimized)
5. **Mist** - Ultra calm (ADHD-optimized)

All themes tested for accessibility and readability.

---

## 🏗️ Project Structure

```
Habit-Flow/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline support
├── icon-192.svg           # App icon
│
├── css/
│   ├── styles.css         # Base styles and themes
│   ├── phase3-ui.css      # Phase 3 enhancements
│   └── phase3-mobile.css  # Mobile optimizations
│
├── modules/
│   ├── HabitManager.js    # Habit CRUD operations
│   ├── StatsCalculator.js # Analytics engine
│   ├── UIRenderer.js      # UI rendering logic
│   ├── EventHandlers.js   # Event management
│   └── SettingsManager.js # Settings & themes
│
├── utils/
│   ├── dateHelpers.js     # Date utilities
│   └── storage.js         # LocalStorage wrapper
│
├── tests/
│   ├── HabitManager.test.js
│   ├── StatsCalculator.test.js
│   └── ... (100% coverage)
│
└── docs/
    ├── API-DOCS.md
    ├── ARCHITECTURE.md
    └── DEPLOYMENT.md
```

---

## 💻 Development

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- HTTP server (for ES6 modules)
- Node.js 18+ (for testing)

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/sivagp-app/Habit-Flow.git
cd Habit-Flow

# Install dev dependencies (for testing)
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Serve locally
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Run specific test file
npm test HabitManager.test.js

# Watch mode for TDD
npm run test:watch

# Coverage report
npm run test:coverage
```

### Code Quality
- ✅ ES6 modules with clear separation
- ✅ JSDoc comments for all public methods
- ✅ Comprehensive error handling
- ✅ Defensive programming patterns
- ✅ 100% test coverage maintained

---

## 🎯 Features Breakdown

### Tracking Types

**1. Simple Tracking**
- One-tap to mark complete
- Perfect for yes/no habits
- Examples: Meditate, Exercise, Read

**2. Quantity Tracking**
- Track specific amounts
- Units: glasses, pages, minutes, km, reps, calories
- Examples: Water intake, Reading pages, Steps

**3. Duration Tracking**
- Track time spent
- Examples: Study time, Practice sessions

### Analytics

**Streak Tracking**
- Current streak (consecutive days)
- Longest streak (personal best)
- Automatic calculation on completion

**Completion Rate**
- Weekly completion percentage
- Monthly completion percentage
- Visual progress indicators

**Monthly Heatmap**
- Calendar view of completions
- Color-coded by completion level
- Hover for detailed stats
- Perfect 0px alignment (Phase 3 fix)

### Notes & Context
- Add notes to any completion
- View completion history
- Track progress over time
- Export notes with data

---

## 🔧 Configuration

### Theme Customization
Themes use CSS variables for easy customization:

```css
/* Edit css/styles.css */
body.your-theme {
    --color-bg: #your-background;
    --color-primary: #your-accent;
    --color-text: #your-text;
    /* ... more variables */
}
```

### Storage
All data stored in browser LocalStorage:
- Habits: `habitFlow_habits`
- Completions: `habitFlow_completions`
- Settings: `habitFlow_settings`

**Export your data regularly!** Settings → Export Data

---

## 📱 Browser Support

### Desktop
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Mobile
- ✅ iOS Safari 14+
- ✅ Chrome Android 90+
- ✅ Samsung Internet 14+

### PWA Support
- ✅ Installable on all platforms
- ✅ Offline functionality
- ✅ App-like experience

---

## 🚀 Deployment

### GitHub Pages (Current)
```bash
# Push to main branch
git push origin main

# Automatic deployment to:
# https://sivagp-app.github.io/Habit-Flow/
```

### Alternative Platforms
- **Netlify** - Drag & drop deployment
- **Vercel** - Git integration
- **Cloudflare Pages** - Global CDN

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 🛠️ Troubleshooting

### Common Issues

**Habits not saving**
- Check if browser is in private/incognito mode
- Verify LocalStorage is enabled
- Clear browser cache and reload

**Blank page**
- Ensure all files are in correct directories
- Check browser console for errors
- Verify HTTP server is running (not file://)

**Styles not loading**
- Hard refresh: Ctrl + Shift + R (Windows) or Cmd + Shift + R (Mac)
- Clear browser cache
- Check CSS file paths in index.html

**Tests failing**
- Ensure Node.js 18+ is installed
- Run `npm install` to get dependencies
- Check test file paths

### Debug Mode
```javascript
// Open browser console (F12)
// View stored data
console.log(localStorage.getItem('habitFlow_habits'));
console.log(localStorage.getItem('habitFlow_completions'));

// Clear all data (careful!)
localStorage.clear();
```

---

## 🎓 Learning Resources

### For Beginners
- [START-HERE.md](./START-HERE.md) - Complete beginner's guide
- [MDN Web Docs](https://developer.mozilla.org) - HTML, CSS, JavaScript reference
- [JavaScript.info](https://javascript.info) - In-depth JavaScript tutorials

### For Developers
- [QUICK-REFERENCE.md](./QUICK-REFERENCE.md) - Developer quick reference
- [API-DOCS.md](./docs/API-DOCS.md) - API documentation
- [ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture overview

---

## 🗺️ Roadmap

### Phase 3 - Complete ✅
- ✅ Monthly view with perfect alignment
- ✅ ADHD-optimized stat cards
- ✅ CSS consolidation (7 files → 3)
- ✅ Mobile responsive design
- ✅ Theme compatibility fixes
- ✅ Settings modal polish

### Phase 3 Tier 2 - Planned 🎯
- [ ] Celebration animations on streak milestones
- [ ] Curated habit templates (ADHD-focused)
- [ ] Habit categories with color coding
- [ ] Advanced filtering and search
- [ ] Multi-language support

### Phase 3 Tier 3 - Future 🚀
- [ ] iOS App Store conversion
- [ ] Data sync across devices
- [ ] Social sharing features
- [ ] Habit insights and AI suggestions
- [ ] Premium template marketplace

See [ROADMAP.md](./docs/ROADMAP.md) for detailed planning.

---

## 🤝 Contributing

Currently a personal project, but feedback and suggestions are welcome!

**How to provide feedback:**
1. Use the app and take notes
2. Submit issues on GitHub
3. Share suggestions for improvements

**Areas for contribution:**
- Bug reports
- Feature suggestions
- Translation (for multi-language support)
- ADHD-focused habit templates

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) for details.

**TLDR:** Free to use, modify, and distribute. No attribution required but appreciated!

---

## 👨‍💻 Author

**Siva**
- Product Manager & Developer
- Building tools for better habits and productivity
- Specializing in ADHD-friendly app design

---

## 🙏 Acknowledgments

- **Anthropic Claude** - Development assistant and pair programmer
- **Vitest** - Fast and modern testing framework
- **Modern Web Stack** - Built with vanilla JS, no heavy frameworks

---

## 📊 Stats

- **Lines of Code:** ~8,000
- **Test Coverage:** 100%
- **Themes:** 6
- **Tracking Types:** 3
- **Supported Browsers:** 8+
- **Load Time:** < 1s
- **Bundle Size:** < 100KB

---

## 🔗 Links

- **Live App:** https://sivagp-app.github.io/Habit-Flow/
- **GitHub:** https://github.com/sivagp-app/Habit-Flow
- **Documentation:** [docs/](./docs/)
- **Issue Tracker:** GitHub Issues

---

## 💡 Pro Tips

1. **Start Small** - Begin with 3-5 habits
2. **Be Consistent** - Check in at the same time daily
3. **Use Notes** - Track why you completed or missed habits
4. **Export Regularly** - Backup your data monthly
5. **Try Themes** - Find the one that works best for your focus
6. **Install as App** - For quick access from home screen

---

**Made with ❤️ to build better habits and learn to code**

Ready to start? Check out [START-HERE.md](./START-HERE.md)!

# Driver Notes App Changelog

## V3.1.0 - January 28, 2025

### 🔧 Improvements
- **Fixed comment timestamp formatting** - Comments now show clean time format (e.g., "2:30 PM") instead of long ISO timestamps
- **Removed calendar emoji** from comments for cleaner appearance
- **Improved mobile readability** with more compact comment display

### 📝 Comment Format Changes
- **Before**: `💬 Scott Speed commented: Great job!`<br>`📅 2025-01-28T19:30:45.123Z`
- **After**: `💬 Scott Speed commented: Great job! • 2:30 PM`

---

## V3.0.0 - January 28, 2025

### 🎯 Major Features
- **Focus Management System** - Create priority "Focus" items that appear prominently on athlete profiles
- **Enhanced Mobile Experience** - Progressive Web App (PWA) with iPhone installation support
- **Clean Architecture** - Refactored from 2,131-line monolithic file to modular components (68% reduction)
- **Delete Functionality** - Clean delete buttons for notes and focus items
- **Improved UI/UX** - Better styling, compact reminders, mobile-optimized interface

### 🔧 Technical Improvements
- **Modular Components** - 15+ organized, reusable components
- **Enhanced TypeScript** - Better type safety and interfaces
- **Google Sheets Integration** - Added Type column support for Focus/Note distinction
- **Production Ready** - Comprehensive documentation and deployment guides

### 📱 Mobile Features
- **iPhone PWA** - Install as native iPhone app
- **Offline Support** - Service worker for offline functionality
- **Touch Optimized** - Haptic feedback and mobile-friendly interface

### 🎨 Visual Enhancements
- **Focus Items** - Red color scheme with 🎯 badges for visual prominence
- **Athlete Dashboard** - Enhanced profiles with dedicated Focus section
- **Recent Notes** - Improved styling with Focus item distinction

### 📊 Performance
- **68% Code Reduction** - From 2,131 to 685 lines in main file
- **Better Mobile Performance** - Optimized for mobile devices
- **Efficient Data Fetching** - Improved API calls with caching

---

## Version Numbering System

- **Major versions** (3.0, 4.0): Significant new features or breaking changes
- **Minor versions** (3.1, 3.2): New features, improvements, or notable fixes
- **Patch versions** (3.1.1, 3.1.2): Bug fixes and small improvements

Each update will be documented here with clear descriptions of what changed. 
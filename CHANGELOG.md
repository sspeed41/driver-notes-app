# Driver Notes App Changelog

## V3.5.0 - January 28, 2025

### 🎯 New Feature: Role-Based "My View" Toggle
- **Team-specific filtering** - Filter notes by your role and expertise area
- **Josh Wise (Psychology)** - See only psychological notes and content
- **Scott Speed (Technical & Tactical)** - See technical and tactical notes  
- **Dan Jansen (Physical)** - See only physical training and fitness notes
- **Dan Stratton (General)** - See all notes (no filtering applied)

### 🎨 Visual Enhancements
- **Color-coded role badges** - Purple=Psychology, Blue=Technical/Tactical, Green=Physical
- **Smart toggle button** - Only appears for users with specific roles
- **Role indicators** - Clear visual badges showing note creator's expertise area
- **Filtered view messaging** - Shows when "My View" is active with role context

### 🔧 Technical Implementation
- **Smart filtering logic** - Checks note tags, hashtags, and content keywords
- **Persistent preferences** - "My View" setting saved to localStorage
- **Enhanced components** - Updated RecentNotes and AthleteDashboard with filtering
- **New role mapping system** - `utils/roleMapping.ts` for role management

### 💡 How It Works
- Toggle "My View" in the header to see only notes relevant to your role
- Filtering works across Recent Notes, Athlete Dashboard, and Focus Areas
- Notes are matched by tags (#psychological, #technical, #physical) and content
- Switch back to "All Notes" view anytime to see everything

---

## V3.4.0 - January 28, 2025

### 🔔 New Feature: Team Notifications
- **Real-time notifications** - Get notified when other team members create notes
- **Browser notifications** - Native browser notifications with note preview
- **Smart filtering** - Only shows notifications for notes from other users (not your own)
- **Notification toggle** - Enable/disable notifications with header button
- **Auto-dismiss** - Notifications automatically close after 5 seconds
- **Status messages** - In-app status when new notes arrive

### 🎯 How It Works
- **Automatic detection** - Checks for new notes every 30 seconds
- **Permission request** - Asks for notification permission on first use
- **Visual indicator** - Bell icon in header shows notification status
- **Example**: When Dan Stratton creates a note about Dawson Sutton, Scott Speed gets notified

### 📱 Notification Format
- **Title**: "New Note: [Driver Name]" or "New Focus: [Driver Name]"
- **Body**: "[Note Taker]: [First 100 characters of note]..."
- **Icon**: W.O. Optimization logo

### 🎨 UI Improvements
- Added role-specific color coding (Purple=Psychology, Blue=Technical/Tactical, Green=Physical)
- Enhanced header with role display and smart toggle button
- Improved Recent Notes and Athlete Dashboard with role filtering
- Clear visual indicators when filtered view is active

### 🔧 Technical Improvements
- New `utils/roleMapping.ts` for role management
- Enhanced filtering logic in RecentNotes and AthleteDashboard components
- Improved state management for role-based preferences

---

## V3.3.0 - January 28, 2025

### 🔧 Improvements
- **Fixed comment formatting comprehensively** - All comment formats now display consistently
- **Removed emojis from comments** - Clean text-only format for better readability
- **Standardized relative time** - All timestamps show as "2h ago", "1d ago", etc.
- **Enhanced comment parsing** - Handles all existing comment formats in Google Sheets

### 📝 Comment Format Changes
- **Before**: `💬 Scott Speed commented: Great job! 📅 2025-01-28T19:30:45.123Z`
- **After**: `Scott Speed commented: Great job! • 2h ago`

### 🔍 Technical Details
- Added comprehensive regex patterns to handle all comment variations
- Improved relative time calculation for better accuracy
- Enhanced comment parsing to handle legacy formats

---

## V3.2.0 - January 28, 2025

### 🔧 Improvements
- **Removed race and performance results** from athlete profiles for a cleaner, more focused interface
- **Simplified athlete dashboard** to focus on essential information
- **Improved mobile experience** with less cluttered athlete profiles

### 📊 Changes Made
- Removed "Quick Stats" section showing:
  - Next Race
  - Last Race
  - Average Finish
  - Points
- Streamlined athlete profile to focus on:
  - Focus Areas
  - Personal Information
  - Team Information
  - Contact Information
  - Recent Notes

---

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
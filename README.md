# Driver Notes App V3.0.0

A professional racing driver notes and feedback system with focus management, built with Next.js, TypeScript, and Google Sheets integration.

## 🎯 Key Features

### Focus Management System
- **Priority Items**: Create "Focus" entries that appear prominently on athlete profiles
- **Visual Distinction**: Focus items display with red styling and 🎯 badges
- **Team Alignment**: Ensure everyone sees the same priority areas for each driver

### Professional Note-Taking
- **Speech-to-Text**: Voice recording with racing terminology corrections
- **Smart Tagging**: Automatic hashtag detection (#physical, #psychological, #tactical, #technical)
- **Comment System**: Reply to notes with threaded conversations
- **Reminder System**: Set follow-up reminders with notifications

### Athlete Management
- **Comprehensive Profiles**: Detailed athlete information with contact details
- **Performance Tracking**: Historical notes and progress monitoring
- **Team Information**: Crew chief, spotter, and contact information
- **Focus Areas**: Prominent display of current priorities

### Mobile-First Design
- **iPhone PWA**: Install as native iPhone app
- **Offline Support**: Works without internet connection
- **Touch Optimized**: Haptic feedback and mobile-friendly interface
- **Real-time Sync**: Automatic synchronization across devices

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone https://github.com/your-username/driver-notes-app.git
cd driver-notes-app
npm install
```

### 2. Set Up Google Sheets
1. Create a Google Cloud project and enable Sheets API
2. Create a service account and download credentials
3. Create a Google Sheet with headers: `Driver | Note Taker | Note | Timestamp | Type | Tags`
4. Share the sheet with your service account email

### 3. Configure Environment
Create `.env.local`:
```env
GOOGLE_SHEETS_CREDENTIALS={"type":"service_account",...}
GOOGLE_SHEETS_SPREADSHEET_ID=your-spreadsheet-id
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
npm run build
# Deploy to Vercel with environment variables
```

## 📱 iPhone App Installation

### Option 1: PWA Installation (Recommended)
1. Open the app in Safari on iPhone
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will install like a native app

### Option 2: Automated Deployment
```bash
./deploy-to-iphone.sh
```

## 🎯 Usage Guide

### Creating Focus Items
1. Select a driver
2. Choose "Focus" as entry type
3. Write the priority item (e.g., "Improve consistency in turns 1-2")
4. Save - it will appear prominently on the driver's profile

### Managing Athletes
1. Tap "Athletes" in bottom navigation
2. Select a driver to view their profile
3. See Focus items at the top in red section
4. View all historical notes below
5. Edit contact information as needed

### Setting Reminders
1. Tap the bell icon on any note
2. Set date, time, and custom message
3. Receive notifications when due
4. Mark complete or dismiss as needed

## 🏗️ Architecture

### Component Structure
```
components/
├── AthleteDashboard.tsx    # Athlete profiles and management
├── RecentNotes.tsx         # Notes feed with Focus distinction
├── NoteTypeSelector.tsx    # Toggle between Note/Focus
├── Reminders.tsx           # Reminder management
├── Header.tsx              # App header with user info
└── BottomNavigation.tsx    # Mobile navigation
```

### Data Flow
```
User Input → API → Google Sheets → Real-time Sync → UI Update
```

### Google Sheets Schema
```
Column A: Driver
Column B: Note Taker
Column C: Note
Column D: Timestamp
Column E: Type (Note/Focus)
Column F: Tags
```

## 🔧 Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: Google Sheets API
- **Deployment**: Vercel
- **Mobile**: Progressive Web App (PWA)
- **Speech**: Web Speech API
- **Icons**: Font Awesome

## 📊 Performance Metrics

### V3 Improvements
- **68% Code Reduction**: From 2,131 to 685 lines in main file
- **15+ Components**: Modular, reusable architecture
- **Native Mobile**: PWA with offline support
- **Focus System**: Professional priority management

## 🎯 Use Cases

### Racing Teams
- **Driver Development**: Track progress and set priorities
- **Team Communication**: Centralized feedback system
- **Performance Analysis**: Historical data and trends
- **Mobile Access**: Use during practice and races

### Individual Drivers
- **Self-Improvement**: Track personal development
- **Goal Setting**: Clear focus areas and priorities
- **Progress Monitoring**: Historical feedback review
- **Team Coordination**: Share with coaches and crew

## 🔒 Security & Privacy

- **Secure Authentication**: Google service account authentication
- **Data Encryption**: HTTPS and secure API endpoints
- **Access Control**: Team-based access management
- **Data Backup**: Google Sheets reliability and version history

## 📈 Roadmap

### Planned Features
- **Analytics Dashboard**: Data visualization and insights
- **Multi-Team Support**: Separate team environments
- **Advanced Reminders**: Recurring and conditional reminders
- **Integration APIs**: Connect with other racing tools

### Performance Improvements
- **Enhanced Caching**: Better offline experience
- **Real-time Updates**: Live collaboration features
- **Advanced Search**: Filter and search capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

- **Documentation**: Complete guides in `/docs`
- **Issues**: GitHub Issues for bug reports
- **Features**: Feature requests welcome
- **Contact**: [Your contact information]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎉 V3.0.0 Highlights

✅ **Professional Focus Management System**  
✅ **Native iPhone App Experience**  
✅ **Clean, Maintainable Architecture**  
✅ **Enhanced Mobile Performance**  
✅ **Production-Ready Deployment**  

**Ready for professional racing teams of all sizes.** 
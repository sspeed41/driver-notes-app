# Driver Notes App

A web application for recording and saving driver notes directly to Google Sheets using speech-to-text functionality.

## Features

- Speech-to-text note taking
- Driver selection (25 drivers)
- Note taker selection (4 note takers)
- Note tagging with #hashtags
- Direct Google Sheets integration for real-time cloud storage
- Responsive design
- Dark mode UI
- Mobile access

## Setup

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Set up Google Sheets integration:
   - Follow the detailed setup guide in `docs/google-sheets-setup.md`
   - Create a `.env.local` file with your Google credentials
   - Share your Google Sheet with the service account

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Google Sheets Integration

The app saves notes directly to Google Sheets for real-time cloud storage and analysis. To set this up:

1. Follow the detailed setup guide in `docs/google-sheets-setup.md`
2. Create a `.env.local` file with your Google credentials
3. Restart the server after configuration

## Usage

1. Select a driver from the dropdown menu (25 drivers available)
2. Select a note taker (Scott Speed, Josh Wise, Dan Jansen, Dan Stratton)
3. Click the microphone icon to start/stop voice recording, or type your note directly
4. Use #hashtags in your notes for better organization (e.g., "#performance #qualifying")
5. Click "Save Note to Google Sheets" to save directly to the cloud
6. Access your notes in real-time from your Google Sheet for analysis

## Mobile Access

The app can be accessed from your iPhone or other mobile devices:

1. Ensure your mobile device is on the same WiFi network as your computer
2. On your mobile device, open the browser and navigate to:
   ```
   http://YOUR-COMPUTER-IP:3000
   ```
   
   (Example: http://10.0.0.40:3000)

## Data Analysis

All notes are saved to Google Sheets with the following columns:
- Driver
- Note Taker
- Note
- Timestamp
- Tags

This format makes it easy to:
- Filter notes by driver or note taker
- Sort by timestamp
- Analyze performance trends
- Create charts and graphs
- Export data for further analysis

## Technologies Used

- Next.js
- TypeScript
- Tailwind CSS
- Web Speech API
- Google Sheets API

## Browser Compatibility

The speech-to-text functionality requires a modern browser that supports the Web Speech API. Chrome and Edge are recommended for the best experience. 
#!/bin/bash

# Driver Notes App - Quick Recovery Script
# Run this if your app stops working with Google Sheets

echo "🔧 Driver Notes App Recovery Script"
echo "=================================="

# Check if backup exists
BACKUP_DIR="backups/2025-05-26"
if [ ! -f "$BACKUP_DIR/env.local.working" ]; then
    echo "❌ Backup file not found at $BACKUP_DIR/env.local.working"
    echo "Please check the backups directory"
    exit 1
fi

# Backup current .env.local if it exists
if [ -f ".env.local" ]; then
    echo "📦 Backing up current .env.local to .env.local.backup-$(date +%H%M%S)"
    cp .env.local ".env.local.backup-$(date +%H%M%S)"
fi

# Restore working version
echo "🔄 Restoring working .env.local file..."
cp "$BACKUP_DIR/env.local.working" .env.local

# Verify the file
echo "✅ Verifying file format..."
LINES=$(wc -l < .env.local)
if [ "$LINES" -eq 2 ]; then
    echo "✅ File format correct (2 lines)"
else
    echo "⚠️  Warning: File has $LINES lines (expected 2)"
fi

# Test if credentials can be parsed
echo "🧪 Testing JSON parsing..."
if node -e "
const fs = require('fs');
const content = fs.readFileSync('.env.local', 'utf8');
const lines = content.split('\n');
const credsLine = lines.find(line => line.startsWith('GOOGLE_SHEETS_CREDENTIALS='));
if (credsLine) {
    const json = credsLine.split('=')[1];
    JSON.parse(json);
    console.log('✅ JSON parsing successful');
} else {
    console.log('❌ No credentials line found');
}
" 2>/dev/null; then
    echo "✅ Credentials file is valid"
else
    echo "❌ JSON parsing failed - check the file manually"
fi

echo ""
echo "🚀 Recovery complete! Next steps:"
echo "1. Restart your development server: npm run dev"
echo "2. Test the API: curl http://localhost:3000/api/sheets"
echo "3. Check the browser at http://localhost:3000"
echo ""
echo "📚 For more details, see: $BACKUP_DIR/RECOVERY_INSTRUCTIONS.md" 
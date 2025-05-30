#!/bin/bash

echo "🚀 Driver Notes iPhone App Deployment Script"
echo "============================================="

# Check if required files exist
echo "📋 Checking PWA files..."

if [ ! -f "public/manifest.json" ]; then
    echo "❌ manifest.json not found"
    exit 1
else
    echo "✅ manifest.json found"
fi

if [ ! -f "public/sw.js" ]; then
    echo "❌ service worker not found"
    exit 1
else
    echo "✅ service worker found"
fi

# Check for required icons
echo "🎨 Checking app icons..."
missing_icons=false

if [ ! -f "public/images/icon-192.png" ]; then
    echo "❌ icon-192.png missing"
    missing_icons=true
fi

if [ ! -f "public/images/icon-512.png" ]; then
    echo "❌ icon-512.png missing"
    missing_icons=true
fi

if [ ! -f "public/images/apple-touch-icon.png" ]; then
    echo "❌ apple-touch-icon.png missing"
    missing_icons=true
fi

if [ "$missing_icons" = true ]; then
    echo ""
    echo "🚨 MISSING ICONS - Please create the following files:"
    echo "   • public/images/icon-192.png (192x192 pixels)"
    echo "   • public/images/icon-512.png (512x512 pixels)"
    echo "   • public/images/apple-touch-icon.png (180x180 pixels)"
    echo ""
    echo "💡 Use these tools to create icons from your logo:"
    echo "   • https://favicon.io/favicon-converter/"
    echo "   • https://realfavicongenerator.net/"
    echo "   • https://www.pwabuilder.com/imageGenerator"
    echo ""
    read -p "Press Enter after creating the icons to continue..."
fi

# Build the app
echo "🔨 Building the app..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Check if Vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "   (You may need to login to Vercel if this is your first time)"

vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! Your app is now deployed!"
    echo ""
    echo "📱 To install on your iPhone:"
    echo "   1. Open Safari on your iPhone"
    echo "   2. Go to the URL shown above"
    echo "   3. Tap the Share button (square with arrow)"
    echo "   4. Tap 'Add to Home Screen'"
    echo "   5. Tap 'Add'"
    echo ""
    echo "✨ Your Driver Notes app will now appear on your home screen!"
else
    echo "❌ Deployment failed"
    echo "💡 Try running 'vercel login' first, then run this script again"
fi 
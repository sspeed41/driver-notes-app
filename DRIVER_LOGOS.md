# 🏁 Driver Logo Setup Guide

This guide explains how to add custom logos for your drivers in the Driver Notes app.

## 📁 File Structure

Driver logos should be placed in the following directory:
```
public/images/drivers/
```

## 🎨 Logo Requirements

### File Format
- **Format**: PNG (recommended) or JPG
- **Size**: 200x200 pixels minimum (square aspect ratio)
- **Background**: Transparent PNG preferred for best results

### Naming Convention
Driver logos must follow this exact naming pattern:
- Convert driver name to lowercase
- Replace spaces with hyphens
- Add `.png` extension

**Examples:**
- `Kyle Larson` → `kyle-larson.png`
- `Alex Bowman` → `alex-bowman.png`
- `Ross Chastain` → `ross-chastain.png`
- `Daniel Suarez` → `daniel-suarez.png`

## 📋 Current Drivers List

Here are all the drivers in your app and their required filenames:

| Driver Name | Required Filename |
|-------------|------------------|
| Kyle Larson | `kyle-larson.png` |
| Alex Bowman | `alex-bowman.png` |
| Ross Chastain | `ross-chastain.png` |
| Daniel Suarez | `daniel-suarez.png` |
| Austin Dillon | `austin-dillon.png` |
| Connor Zilisch | `connor-zilisch.png` |
| Carson Kvapil | `carson-kvapil.png` |
| Austin Hill | `austin-hill.png` |
| Jesse Love | `jesse-love.png` |
| Nick Sanchez | `nick-sanchez.png` |
| Daniel Dye | `daniel-dye.png` |
| Grant Enfinger | `grant-enfinger.png` |
| Daniel Hemric | `daniel-hemric.png` |
| Connor Mosack | `connor-mosack.png` |
| Kaden Honeycutt | `kaden-honeycutt.png` |
| Rajah Caruth | `rajah-caruth.png` |
| Andres Perez | `andres-perez.png` |
| Matt Mills | `matt-mills.png` |
| Dawson Sutton | `dawson-sutton.png` |
| Tristan McKee | `tristan-mckee.png` |
| Helio Meza | `helio-meza.png` |
| Corey Day | `corey-day.png` |
| Ben Maier | `ben-maier.png` |
| Tyler Reif | `tyler-reif.png` |
| Brenden Queen | `brenden-queen.png` |

## 🎯 Logo Design Tips

### What Makes a Good Driver Logo:
1. **Clear and Simple**: Should be readable at small sizes
2. **High Contrast**: Works well on dark backgrounds
3. **Professional**: Represents the driver/team brand
4. **Consistent Style**: Matches your app's aesthetic

### Logo Ideas:
- **Team Logos**: Official team/sponsor logos
- **Car Numbers**: Stylized racing numbers
- **Driver Initials**: Custom designed initials
- **Helmet Designs**: Simplified helmet graphics
- **Sponsor Logos**: Primary sponsor branding

## 🔄 Fallback System

If a driver logo isn't found, the app automatically shows:
1. **Colored Circle**: With driver's initials
2. **Consistent Colors**: Same color for each driver
3. **Racing Icon**: Small car icon overlay

## 📱 How It Works

The `DriverLogo` component:
- Automatically looks for logos in `/images/drivers/`
- Uses the driver name to generate the filename
- Falls back to initials if no logo is found
- Displays consistently across all app sections

## 🚀 Adding Logos

1. **Create/Download** your driver logos
2. **Resize** them to 200x200 pixels (square)
3. **Rename** using the exact filenames from the table above
4. **Upload** to `public/images/drivers/` folder
5. **Refresh** your app - logos appear automatically!

## 🎨 Logo Creation Tools

### Free Options:
- **Canva**: Easy drag-and-drop design
- **GIMP**: Free image editor
- **Figma**: Professional design tool

### AI Logo Generators:
- **Midjourney**: "racing driver logo for [name]"
- **DALL-E**: "professional racing logo"
- **Stable Diffusion**: Custom prompts

## 📝 Example Logo Creation Process

1. **Research**: Find official team/sponsor logos
2. **Design**: Create 200x200px canvas
3. **Style**: Match your app's color scheme
4. **Export**: Save as PNG with transparency
5. **Name**: Use exact filename from table
6. **Upload**: Place in `/images/drivers/` folder

## 🔧 Troubleshooting

**Logo not showing?**
- Check filename exactly matches table above
- Ensure file is in `/images/drivers/` folder
- Verify file format is PNG or JPG
- Clear browser cache and refresh

**Logo looks blurry?**
- Use higher resolution source image
- Ensure square aspect ratio
- Save as PNG for best quality

## 🎯 Pro Tips

- **Batch Process**: Use tools like Photoshop actions for consistent sizing
- **Version Control**: Keep source files for future edits
- **Backup**: Store logos in cloud storage
- **Consistency**: Use similar style across all drivers
- **Testing**: Check how logos look on mobile devices

---

Need help? The app works great with or without custom logos - the fallback system ensures every driver has a unique, professional appearance! 
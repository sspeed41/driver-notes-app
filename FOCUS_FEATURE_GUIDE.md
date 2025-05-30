# 🎯 Focus Feature Guide

## Overview
The new **Focus** feature allows you to create priority items that appear prominently on each driver's athlete profile page. This is perfect for highlighting current goals, key areas of improvement, or important priorities for each driver.

## How to Use Focus Items

### Creating a Focus Item
1. **Select a Driver** from the dropdown
2. **Choose "Focus"** instead of "Note" in the Entry Type selector
3. **Write your focus content** - this should be a priority item or key area
4. **Add relevant tags** if desired
5. **Save** - it will appear as "Focus saved successfully!"

### Where Focus Items Appear
- **Athlete Dashboard**: Focus items appear in a prominent orange section at the top of each driver's profile
- **Recent Notes Feed**: Focus items are marked with a 🎯 Focus badge
- **Separate from Regular Notes**: Focus items are displayed separately from regular notes

## Visual Design

### Focus Items Display
- **Prominent Orange Section** at the top of athlete profiles
- **Gradient Background** (orange to amber) for high visibility
- **Bullseye Icon** to indicate priority status
- **Numbered Items** (Focus Item #1, #2, etc.)
- **Author and Timestamp** for each focus item

### Recent Notes Feed
- Focus items show a **🎯 Focus** badge
- Orange color scheme to distinguish from regular notes
- Same functionality (comments, reminders) as regular notes

## Best Practices

### What to Use Focus For:
✅ **Current Training Goals** - "Work on turn entry consistency"
✅ **Key Areas of Improvement** - "Focus on communication with spotter"
✅ **Race Weekend Priorities** - "Maintain tire management in long runs"
✅ **Mental/Physical Goals** - "Improve pre-race routine and focus"
✅ **Technical Focus Areas** - "Master trail braking in turns 3-4"

### What to Use Regular Notes For:
📝 **Session Observations** - "Good pace in practice, struggled with traffic"
📝 **General Feedback** - "Driver seemed more confident today"
📝 **Race Reports** - "Finished 3rd, good recovery from early spin"
📝 **Day-to-day Updates** - "Completed simulator session"

## Technical Details

### Data Structure
- Focus items are stored with `Type: 'Focus'` in the database
- Regular notes have `Type: 'Note'` (or no type field for backward compatibility)
- All existing functionality (tags, comments, reminders) works with both types

### Database Schema
```
Driver | Note Taker | Note | Timestamp | Type | Tags
-------|------------|------|-----------|------|-----
Kyle Larson | Scott Speed | Work on consistency in turns 1-2 | 1/28/2025 | Focus | technical
Kyle Larson | Josh Wise | Good practice session today | 1/28/2025 | Note | performance
```

## Examples

### Good Focus Items:
- "Improve qualifying performance - focus on single-lap pace"
- "Work on communication with crew chief during pit stops"
- "Develop better tire management strategy for long runs"
- "Master wet weather driving techniques"

### Regular Note Examples:
- "Had a good practice session, car felt balanced"
- "Struggled with traffic in qualifying"
- "Finished 5th in the race, solid points day"
- "Completed fitness training session"

## Benefits

1. **Clear Priorities** - Drivers and coaches can quickly see what to focus on
2. **Visual Prominence** - Important items don't get lost in regular notes
3. **Better Organization** - Separate current priorities from historical observations
4. **Team Alignment** - Everyone can see the same priority areas
5. **Progress Tracking** - Easy to see when focus areas are updated or completed

## Tips for Coaches

- **Keep Focus Items Current** - Update or remove completed focus areas
- **Limit Focus Items** - 2-3 active focus items per driver works best
- **Be Specific** - "Improve turn 3 entry" vs "Drive better"
- **Include Measurable Goals** - "Reduce lap time by 0.2s in sector 2"
- **Regular Review** - Check focus items weekly and update as needed

The Focus feature helps ensure that priority areas get the attention they deserve and don't get buried in the regular notes feed! 
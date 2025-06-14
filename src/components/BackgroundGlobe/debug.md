# Globe Debug Guide

## Current Status
- Globe opacity increased to 0.4 (from 0.15)
- Clock opacity increased to 0.7 (from 0.3)
- Globe size: 1200px
- Clock size: 45px
- Labels enabled: true

## Troubleshooting Steps

### 1. Check Browser Console
Open browser dev tools (F12) and look for:
- JavaScript errors
- Failed imports
- CSS issues

### 2. Verify Globe Positioning
The globe should be:
- Position: fixed
- z-index: -1 (behind content)
- Full viewport coverage (100vw x 100vh)
- Centered with transform: translate(-50%, -50%)

### 3. Check CSS Loading
Verify `globe-styles.css` is loaded:
- Look for `.background-globe` styles
- Check if colors are applied
- Verify animations are working

### 4. Test Timezone Override
- Click the globe button in PersonalTimeHero header
- Select a different timezone
- Verify clocks update accordingly
- Check for blue ring indicator when active

### 5. Common Issues
- **Not visible**: Check opacity values in CSS
- **No animation**: Check `prefers-reduced-motion` setting
- **Clocks not updating**: Check useWorldTime hook
- **Override not working**: Check state management in App.tsx

### 6. Quick Visibility Test
Add this to browser console:
```javascript
document.querySelector('.background-globe').style.color = 'rgba(99, 102, 241, 1)';
```

This will make the globe fully visible for testing.

## Expected Behavior
- Subtle rotating globe wireframe in background
- Multiple timezone clocks positioned around globe
- Smooth rotation animation (unless reduced motion)
- Clock hands moving in real-time
- Timezone labels visible
- VPN override functionality working 
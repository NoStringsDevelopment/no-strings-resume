# Unicode Font Support for PDF Export

## Overview

The PDF export feature now includes intelligent Unicode handling with automatic fallback. By default, it will:

1. **Detect Unicode Support**: Test if the browser/system can render Unicode characters
2. **Preserve Characters**: Keep emojis and special characters when support is detected
3. **Graceful Fallback**: Convert problematic characters to text equivalents when needed
4. **Smart Bullet Points**: Use proper Unicode bullets (•) when supported, ASCII dashes (-) when not

## Current Behavior

### With Unicode Support Detected
- ✅ Emojis preserved: `📧 email@example.com • 📞 +1-555-123-4567`
- ✅ Unicode bullets: `• Accomplished this • Achieved that`
- ✅ Special punctuation: em-dashes (—), smart quotes (""), etc.

### With Limited Unicode Support (Fallback)
- 🔄 Emojis converted: `Email: email@example.com | Phone: +1-555-123-4567`
- 🔄 ASCII bullets: `- Accomplished this - Achieved that` 
- 🔄 Safe punctuation: `--` instead of `—`, `"` instead of `""`

## Adding Full Unicode Font Support

For the best Unicode support (including emojis, international characters, and special symbols), you can load a custom Unicode font. Here's how:

### Option 1: Load Google Fonts (Recommended)

Add this to your HTML `<head>` or load dynamically:

```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet">
```

Then modify the PDF export to use the loaded font:

```typescript
// In src/utils/exportUtils.ts, in the exportAsPDF function:

export async function exportAsPDF(resumeData: ResumeData, theme: Theme) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();
  
  // Try to load a Unicode font
  try {
    // Option: Load Noto Sans which has excellent Unicode coverage
    const response = await fetch('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700');
    // ... implement font loading logic
  } catch (error) {
    console.warn('Could not load Unicode font, using fallback');
  }
  
  // rest of the function...
}
```

### Option 2: Bundle a TTF Font

1. **Download a Unicode font** like [Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) or [Inter](https://rsms.me/inter/)

2. **Convert to base64** using the jsPDF font converter or this online tool:
   ```bash
   # Using Node.js
   const fs = require('fs');
   const fontData = fs.readFileSync('path/to/font.ttf');
   const base64Font = fontData.toString('base64');
   ```

3. **Add to your project**:
   ```typescript
   // In src/utils/fonts/noto-sans.ts
   export const notoSansFont = "data:font/truetype;base64,AABAAG..."; // your base64 data
   
   // In src/utils/exportUtils.ts
   import { notoSansFont } from './fonts/noto-sans';
   
   export async function exportAsPDF(resumeData: ResumeData, theme: Theme) {
     const { jsPDF } = await import('jspdf');
     const pdf = new jsPDF();
     
     try {
       // Add the font to jsPDF
       pdf.addFileToVFS("NotoSans.ttf", notoSansFont);
       pdf.addFont("NotoSans.ttf", "NotoSans", "normal");
       pdf.setFont("NotoSans");
       
       console.log('PDF Export: Using NotoSans font with full Unicode support');
       // Set hasUnicodeSupport to true
       const hasUnicodeSupport = true;
       
       // ... rest of function with hasUnicodeSupport = true
     } catch (error) {
       console.warn('Failed to load custom font, using system detection');
       // fallback to current logic
     }
   }
   ```

### Option 3: Use Web Font API

```typescript
async function loadWebFont(): Promise<boolean> {
  try {
    if ('fonts' in document) {
      await document.fonts.load('12px "Noto Color Emoji"');
      await document.fonts.load('12px "Segoe UI"');
      return document.fonts.check('12px "Noto Color Emoji"');
    }
    return false;
  } catch {
    return false;
  }
}
```

## Testing Unicode Support

You can test if your font improvements work by:

1. **Create test resume** with Unicode characters:
   ```json
   {
     "basics": {
       "name": "José María González-Smith",
       "email": "📧 jose@example.com",
       "summary": "Passionate developer who loves building things—especially web apps with émojis! 🚀"
     },
     "work": [{
       "highlights": [
         "• Increased performance by 50%",
         "• Led team of 5 developers",
         "• Implemented CI/CD pipelines"
       ]
     }]
   }
   ```

2. **Export to PDF** and check if:
   - Emojis render correctly (not as boxes or missing)
   - Bullet points are proper Unicode bullets (•)
   - Accented characters display properly
   - Special punctuation looks correct

## Font Recommendations

| Font | Unicode Coverage | Emoji Support | Size | Notes |
|------|------------------|---------------|------|-------|
| **Noto Sans** | Excellent | Via Noto Color Emoji | Medium | Google's comprehensive font family |
| **Inter** | Good | Limited | Small | Modern, clean design |
| **Roboto** | Good | Limited | Small | Google's material design font |
| **System Default** | Varies | Varies | 0KB | Fallback option (current implementation) |

## Implementation Status

- ✅ **Automatic Unicode Detection**: Implemented
- ✅ **Graceful Fallback**: Sanitization works when Unicode fails
- ✅ **Smart Character Replacement**: Emojis → text, bullets → dashes
- ✅ **Comprehensive Testing**: Tests cover both Unicode and fallback modes
- 🔄 **Custom Font Loading**: Ready for implementation (follow guide above)
- 🔄 **Font Caching**: Could be added for performance
- 🔄 **User Font Preferences**: Could allow users to choose fonts

## Performance Considerations

- **Font Loading**: Custom fonts add ~100-500KB to bundle size
- **Detection Speed**: Unicode detection adds ~1-5ms to export time
- **Fallback Cost**: Text sanitization is very fast (<1ms)
- **Memory Usage**: Custom fonts increase PDF memory usage

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Unicode Detection | ✅ | ✅ | ✅ | ✅ |
| Canvas Font Testing | ✅ | ✅ | ✅ | ✅ |
| TTF Font Loading | ✅ | ✅ | ✅ | ✅ |
| Web Font API | ✅ | ✅ | ✅ | ✅ |

 
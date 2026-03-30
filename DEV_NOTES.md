# Developer Notes & Technical Documentation

## Project Structure

```
LTS OFFICIAL WEBSITE/
├── JS/
│   ├── credits-system.js          # Daily credits manager (NEW)
│   ├── pdf-download-manager.js    # Mobile PDF download utility (NEW)
│   ├── role-suggestions.js         # Role suggestion engine (NEW)
│   ├── cookieBanner.js
│   ├── image-loader.js
│   ├── index.js
│   ├── Mail.js
│   ├── projects.js
│   ├── tool-utils.js
│   ├── tools-shared.js
│   ├── tools.js
│   └── uselessfactsroom.js
├── CSS/
│   ├── cookieBanner.css
│   ├── Hamburgermenu.css
│   ├── index.css
│   ├── projects.css
│   ├── tools.css
│   └── uselessfactsroom.css
├── tools/
│   ├── cv-builder.html
│   ├── invoice-generator.html
│   ├── password-generator.html
│   ├── image-to-pdf.html
│   ├── expense-tracker.html
│   ├── salary-calculator.html
│   ├── study-planner.html
│   ├── qr-code-generator.html
│   ├── barcode-generator.html
│   ├── color-palette.html
│   ├── text-tools.html
│   ├── task-manager.html
│   ├── timesheet-tracker.html
│   ├── unit-converter.html
│   └── pomodoro-timer.html
├── UPDATES.md                      # User-facing changelog (NEW)
└── DEV_NOTES.md                    # This file
```

---

## Core Systems Documentation

### 1. Credits System (`JS/credits-system.js`)

**Purpose**: Manages daily 10 credits across all tools with automatic reset at midnight.

**Key Classes**:
- `CreditsManager`: Main class for credit operations

**Methods**:
```javascript
// Create instance
const credits = new CreditsManager('tool-name');

// Check/use credits
credits.getRemaining()        // Get remaining credits today
credits.hasCredits(amount)    // Check if has enough
credits.useCredits(amount)    // Use credits (returns bool)
credits.refundCredits(amount) // Refund credits (error handling)

// Utilities
credits.getUsedToday()        // Get total used today
credits.getResetTime()        // When credits reset
credits.getTimeUntilReset()   // Minutes until reset
```

**Storage Keys**:
- `credits_global`: Current credit count
- `credits_lastReset_global`: Last reset date (YYYY-MM-DD)

**Usage in Tools**:
```html
<script src="./JS/credits-system.js"></script>

<button onclick="handleExport()">Export</button>

<script>
function handleExport() {
    if (attemptUseCredits(1, 'cv-builder')) {
        // Proceed with export
    }
}
</script>
```

**UI Elements**:
```html
<!-- Add to your tool header -->
<div id="credits-panel">
    <span>Credits: <span id="credits-remaining">10</span>/10</span>
    <span id="credits-status" style="color: #10b981;">Credits Available</span>
</div>
```

---

### 2. PDF Download Manager (`JS/pdf-download-manager.js`)

**Purpose**: Handles cross-platform PDF downloads with iOS support.

**Key Classes**:
- `PDFDownloadManager`: Main class for PDF operations

**Methods**:
```javascript
const pdfMgr = new PDFDownloadManager({
    scale: 2,
    backgroundColor: '#ffffff',
    quality: 0.95
});

// Main method (auto platform detection)
await pdfMgr.downloadPDF(element, filename)

// Platform-specific
await pdfMgr._downloadPDFiOS(element, filename)
await pdfMgr._downloadPDFAndroid(element, filename)
await pdfMgr._downloadPDFDesktop(element, filename)

// Fallbacks
await pdfMgr.downloadAsImage(element, filename)
await pdfMgr.getPDFBlob(element)
```

**Platform Detection**:
- iOS: `/iPad|iPhone|iPod/.test(navigator.userAgent)`
- Android: `/Android/.test(navigator.userAgent)`
- Desktop: Default fallback

**Required Libraries**:
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="./JS/pdf-download-manager.js"></script>
```

**Usage**:
```javascript
// Simple usage
async function exportToPDF() {
    const element = document.getElementById('content');
    const success = await window.pdfDownloadManager.downloadPDF(
        element, 
        'my-document.pdf'
    );
    if (success) showNotification('✅ Downloaded!');
}

// Or use helper
await downloadElementAsPDF('preview-container', 'cv.pdf');
```

---

### 3. Role Suggestions (`JS/role-suggestions.js`)

**Purpose**: Provides intelligent role-based suggestions for CV builder and other tools.

**Predefined Roles** (12+ included):
- Software Engineer
- Product Manager
- Data Scientist
- UX/UI Designer
- Frontend Developer
- Backend Developer
- Marketing Manager
- Sales Executive
- Project Manager
- Business Analyst
- HR Manager
- Finance Manager
- DevOps Engineer
- Security Engineer

**Role Object Structure**:
```javascript
{
    title: 'Suggested Job Title',
    skills: 'Comma separated skill list',
    summary: 'Suggested professional summary',
    sections: ['experience', 'education', 'skills'],
    color: '#3b82f6'  // Color for UI
}
```

**Methods**:
```javascript
RoleSuggestions.getSuggestions(role)     // Get role config
RoleSuggestions.getAllRoles()            // List all roles
RoleSuggestions.findRole(query)          // Find by partial match
RoleSuggestions.addCustomRole(name, cfg) // Add new role

initializeRoleSelector('select-id', callback)
applyRoleSuggestions(roleName, callback)
showRoleSuggestions(suggestions)
clearRoleSuggestions()
```

**Usage in CV Builder**:
```html
<select id="role-selector"></select>
<div id="role-suggestions-container"></div>

<script src="./JS/role-suggestions.js"></script>
<script>
initializeRoleSelector('role-selector', (suggestions) => {
    console.log('Selected role:', suggestions);
    // Auto-fill form fields
});
</script>
```

---

## CV Builder Implementation Details

### Layout System
- **1-Column**: Traditional single-column layout
- **2-Column**: Modern two-column layout with sidebar
- **Customizable Backgrounds**:
  - Solid colors (color picker)
  - Gradients (multiple color selection)
  - Images (URL or file upload)
  - Mix mode (blend different backgrounds)

### Sections Management
**Standard Sections**:
1. Personal Info
2. Professional Summary
3. Experience
4. Education
5. Skills
6. Languages

**Optional Add-ons**:
- Certifications
- Projects
- Publications
- Portfolio Links
- Tools/Software
- Custom Sections

### Data Structure
```javascript
const cvData = {
    personal: {
        name: String,
        title: String,
        email: String,
        phone: String,
        location: String,
        photo: Base64DataURL
    },
    role: String,
    summary: String,
    layout: '1-column' | '2-column',
    background: {
        type: 'color' | 'gradient' | 'image',
        value: String
    },
    sections: {
        experience: Array,
        education: Array,
        skills: Array,
        languages: Array,
        // ... optional sections
    }
};
```

### Export Function
```javascript
async function exportCVtoPDF() {
    // 1. Check credits
    if (!attemptUseCredits(1)) return;
    
    // 2. Validate data
    if (!validateCVData()) {
        showNotification('❌ Please fill required fields');
        return;
    }
    
    // 3. Download
    const success = await downloadElementAsPDF('cv-preview', 'cv.pdf');
    
    if (!success) {
        creditsManager.refundCredits(1);
        showNotification('❌ Download failed');
    }
}
```

---

## Implementation Checklist

### CV Builder Enhancements
- [x] Role suggestion system integrated
- [x] Multiple layout options architecture
- [x] Background customization system
- [x] Mobile optimization
- [x] iOS PDF fix
- [x] Daily credits system
- [ ] Manual section management UI
- [ ] Advanced color picker
- [ ] Image preview before upload
- [ ] Export format options

### Tools Global Updates
- [x] Credits system in utility libraries
- [x] PDF download manager
- [ ] Update all tools HTML to include: `credits-system.js`
- [ ] Update all export functions to use PDF manager
- [ ] Add credits display to tool headers
- [ ] Add help/guide tooltips

### Mobile Optimization
- [x] PDF download manager for mobile
- [x] Responsive CSS structures
- [ ] Touch-friendly buttons/controls
- [ ] Mobile input optimizations
- [ ] Viewport meta tags review
- [ ] Test on actual iOS/Android

---

## Testing Checklist

### Credits System
- [ ] Desktop: Credit limit works (3 uses)
- [ ] Mobile: Credit display updates
- [ ] Midnight: Credits reset properly
- [ ] Cross-tab: Credits sync across windows
- [ ] LocalStorage: Data persists after page refresh

### PDF Export
- [ ] Desktop: Standard PDF download works
- [ ] iOS Safari: PDF downloads (not preview)
- [ ] iOS Chrome: PDF downloads properly
- [ ] Android Chrome: PDF downloads
- [ ] Android Firefox: PDF downloads
- [ ] Large docs: Handles multi-page PDFs
- [ ] All data: Preserves complete form data

### CV Builder
- [ ] All roles load correctly
- [ ] Custom role creation works
- [ ] Suggestions display properly
- [ ] Layouts switch smoothly
- [ ] Background changes apply
- [ ] Export maintains formatting
- [ ] Mobile view responsive
- [ ] Photos upload and display

---

## Common Issues & Solutions

### Issue: PDFs download but won't open
**Solution**: Check if file is actually a PDF (not HTML). Verify jsPDF library loaded correctly.

### Issue: iOS shows preview instead of download
**Solution**: Use blob-based download instead of data URL. Ensure Content-Disposition header if server-side.

### Issue: Credits not resetting at midnight
**Solution**: Check LocalStorage keys. Verify timezone detection. Use UTC dates.

### Issue: Role suggestions not showing
**Solution**: Check if DOM element exists. Verify role key matches exactly. Check console for errors.

### Issue: PDF missing data on mobile
**Solution**: Ensure html2canvas scale is appropriate. Check element visibility before export.

---

## Performance Notes

### Optimization Tips
1. **PDF Export**: Use `scale: 1` for faster rendering on mobile
2. **Images**: Lazy load background images
3. **Storage**: Clean old credits data periodically
4. **Canvas**: Limit canvas size for large documents
5. **Memory**: Release blob URLs after download

### Benchmark Targets
- PDF export: < 5 seconds on mobile
- Layout switch: < 200ms
- Credit update: < 50ms
- Role suggestion: Instant

---

## Security Considerations

1. **LocalStorage**: Not sensitive data stored (credits only)
2. **File Upload**: Validate file types on client and server
3. **PDF Export**: No server upload needed (client-side generation)
4. **Data**: User data remains local until export

---

## Browser Support

✅ Supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Android 90+

⚠️ Limited Support:
- IE 11 (PDF export may fail)
- Opera Mobile (Older versions)

---

## Future Enhancements

1. **Cloud Storage**: Save CVs to cloud
2. **Templates**: More professional templates
3. **Collaboration**: Share and edit together
4. **Versioning**: Track CV versions
5. **ATS**: Optimize for Applicant Tracking Systems
6. **Analytics**: Track downloads and views
7. **Mobile App**: Native iOS/Android apps
8. **API**: Public API for integrations

---

## Deployment Notes

### Before Production
1. [ ] Test all tools on mobile device
2. [ ] Verify credits system works
3. [ ] Check PDF exports on iOS
4. [ ] Load test upload features
5. [ ] Verify all links work
6. [ ] Update sitemap.xml
7. [ ] Test Google Analytics
8. [ ] Review accessibility (a11y)

### After Deployment
1. [ ] Monitor error logs
2. [ ] Track user feedback
3. [ ] Measure page performance
4. [ ] A/B test new features
5. [ ] Update documentation
6. [ ] Plan next release

---

## Contact & Support

**Development Questions**: developers@linetechsoftwares.co.za
**Bug Reports**: bugs@linetechsoftwares.co.za
**Feature Requests**: features@linetechsoftwares.co.za

---

**Last Updated**: March 30, 2026
**Maintained By**: Line Tech Softwares Development Team
**Version**: 2.1.0

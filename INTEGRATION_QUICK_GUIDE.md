# Quick Integration Guide - Adding Credits & PDF Export to All Tools

This guide shows how to add the new systems to other tools in 5 minutes.

---

## Quick Checklist

- [ ] Add 3 script includes to tool HTML head
- [ ] Add credits display element to tool UI
- [ ] Update export button onclick handler
- [ ] Update export function to use PDF manager
- [ ] Test on desktop and mobile

---

## Step 1: Add Script Includes

Add these lines to your tool's `<head>` section:

```html
<!-- Credits & Download Systems -->
<script src="../../JS/credits-system.js"></script>
<script src="../../JS/pdf-download-manager.js"></script>
<!-- Optional: If your tool needs role suggestions -->
<script src="../../JS/role-suggestions.js"></script>
```

**Example for Invoice Generator**:
```html
<head>
    <!-- ... existing stuff ... -->
    
    <!-- Font Awesome (if not already included) -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- PDF Libraries -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
    
    <!-- Credits & Download Systems -->
    <script src="../../JS/credits-system.js"></script>
    <script src="../../JS/pdf-download-manager.js"></script>
</head>
```

---

## Step 2: Add Credits Display

Add this HTML element near your export button (usually in a header or toolbar):

```html
<div style="display: inline-flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; background: rgba(59,130,246,0.2); padding: 0.5rem 1rem; border-radius: 20px; border: 1px solid rgba(59,130,246,0.4);">
    <i class="fas fa-bolt" style="color: #f59e0b;"></i> 
    Credits: <span id="credits-remaining" style="color: #3b82f6; font-weight: 600;">10</span>/10
</div>

<!-- Optional: Status indicator -->
<span id="credits-status" style="font-size: 0.8rem; color: #10b981;">✓ Credits Available</span>
```

**For mobile-responsive version**:
```html
<div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; background: rgba(59,130,246,0.2); padding: 0.4rem 0.8rem; border-radius: 20px; border: 1px solid rgba(59,130,246,0.4); flex-wrap: wrap;">
    <i class="fas fa-bolt" style="color: #f59e0b;"></i> 
    <span id="credits-remaining" style="color: #3b82f6; font-weight: 600;">10</span>/10
    <span id="credits-status" style="font-size: 0.75rem; color: #10b981; margin-left: 5px;">✓</span>
</div>
```

---

## Step 3: Update Export Button

Old way (example):
```html
<button onclick="exportInvoice()">Export PDF</button>
```

New way with error handling and credits:
```html
<button onclick="handleExport()" style="background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem 2rem; border: none; border-radius: 40px; font-weight: 600; cursor: pointer;">
    <i class="fas fa-file-pdf"></i> Export Invoice
</button>
```

---

## Step 4: Update Export Function

### Option A: PDF Export (Recommended for CVs, Invoices, etc.)

```javascript
async function handleExport() {
    // Step 1: Check if user has credits
    if (!window.creditsManager.hasCredits(1)) {
        showNotification('❌ No credits! Reset tomorrow at midnight.', 'error');
        return;
    }
    
    // Step 2: Validate data
    const content = document.getElementById('invoice-preview');
    if (!content || !content.innerText.trim()) {
        showNotification('❌ Please fill in the invoice details', 'error');
        return;
    }
    
    // Step 3: Download
    try {
        const filename = document.getElementById('invoice-number')?.value || 'Invoice';
        const success = await window.pdfDownloadManager.downloadPDF(
            content,
            filename + '.pdf'
        );
        
        if (success) {
            // Step 4: Deduct credit only on success
            window.creditsManager.useCredits(1);
            updateCreditsDisplay();
            showNotification('✅ Invoice exported successfully!', 'success');
        } else {
            showNotification('❌ Export failed. Try again or use Image export.', 'error');
        }
    } catch(err) {
        console.error('Export error:', err);
        showNotification('❌ Error during export', 'error');
    }
}

function updateCreditsDisplay() {
    const remaining = window.creditsManager.getRemaining();
    document.getElementById('credits-remaining').textContent = remaining;
    
    const statusElem = document.getElementById('credits-status');
    if (statusElem) {
        if (remaining === 0) {
            statusElem.innerHTML = '❌ Reset Tomorrow';
            statusElem.style.color = '#ef4444';
        } else if (remaining <= 3) {
            statusElem.innerHTML = '⚠️ Low Credits';
            statusElem.style.color = '#f59e0b';
        } else {
            statusElem.innerHTML = '✓ Credits Available';
            statusElem.style.color = '#10b981';
        }
    }
}
```

### Option B: Image Export (For quick sharing)

```javascript
async function handleExportAsImage() {
    if (!window.creditsManager.hasCredits(1)) {
        showNotification('❌ No credits available', 'error');
        return;
    }
    
    const content = document.getElementById('invoice-preview');
    const filename = document.getElementById('invoice-number')?.value || 'Invoice';
    
    try {
        const success = await window.pdfDownloadManager.downloadAsImage(
            content,
            filename + '.png'
        );
        
        if (success) {
            window.creditsManager.useCredits(1);
            updateCreditsDisplay();
            showNotification('✅ Exported as image!', 'success');
        }
    } catch(err) {
        showNotification('❌ Export failed', 'error');
    }
}
```

### Option C: Multiple Export Options (Best UX)

```javascript
async function handleExport() {
    const credits = window.creditsManager.getRemaining();
    
    // Show export options
    const choice = confirm(
        `You have ${credits} credits remaining.\n\n` +
        'Choose export format:\n' +
        'OK = PDF (better for sending)\n' +
        'Cancel = Image (better for sharing)'
    );
    
    if (choice) {
        await exportAsPDF();
    } else {
        await exportAsImage();
    }
}

async function exportAsPDF() {
    if (!window.creditsManager.hasCredits(1)) {
        showNotification('❌ No credits', 'error');
        return;
    }
    
    const success = await window.pdfDownloadManager.downloadPDF(
        document.getElementById('content'),
        'document.pdf'
    );
    
    if (success) {
        window.creditsManager.useCredits(1);
        updateCreditsDisplay();
        showNotification('✅ PDF downloaded!', 'success');
    }
}

async function exportAsImage() {
    if (!window.creditsManager.hasCredits(1)) {
        showNotification('❌ No credits', 'error');
        return;
    }
    
    const success = await window.pdfDownloadManager.downloadAsImage(
        document.getElementById('content'),
        'document.png'
    );
    
    if (success) {
        window.creditsManager.useCredits(1);
        updateCreditsDisplay();
        showNotification('✅ Image exported!', 'success');
    }
}
```

---

## Step 5: Add Notification Function

If your tool doesn't have a notification system, add this:

```javascript
function showNotification(msg, type = 'success') {
    const n = document.createElement('div');
    n.className = 'notification-' + type;
    n.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'error' ? '#ef4444' : '#10b981'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease-out;
        max-width: 350px;
    `;
    n.innerHTML = msg;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3000);
}

// Add animation if not exists
if (!document.querySelector('style[data-notif]')) {
    const style = document.createElement('style');
    style.setAttribute('data-notif', 'true');
    style.textContent = '@keyframes slideIn { from { transform: translateX(400px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }';
    document.head.appendChild(style);
}
```

---

## Step 6: Initialize Credits Display

Add this at the bottom of your script:

```javascript
// Initialize on page load
window.addEventListener('DOMContentLoaded', () => {
    updateCreditsDisplay();
    
    // Auto-update every minute
    setInterval(updateCreditsDisplay, 60000);
});
```

---

## Testing Checklist

```
Tool: ________________  Date: ________

Desktop Testing:
[ ] Can see "Credits: 10/10" display
[ ] Clicking export works
[ ] PDF downloads to default folder
[ ] Open PDF and verify content
[ ] Refresh page - credits still show 10
[ ] Export again - credits show 9
[ ] All data preserved in PDF

Mobile Testing (iOS):
[ ] Can see credits display (responsive)
[ ] Tap export button  
[ ] PDF downloads (not preview)
[ ] Open PDF from Downloads
[ ] Verify all content is there
[ ] Try image export (if applicable)

Mobile Testing (Android):
[ ] Can see credits display
[ ] Tap export button
[ ] PDF downloads to Downloads folder
[ ] Open PDF from notifications
[ ] All data visible in PDF

Edge Cases:
[ ] No content - shows error message
[ ] Zero credits - shows "Reset Tomorrow"
[ ] Large content - PDF spans multiple pages
[ ] Symbols/special characters - preserved in export
[ ] Works offline - no internet needed for generation
```

---

## Common Issues & Fixes

### Issue: Credits not showing
**Solution**: Make sure `credits-system.js` is loaded before your script
```html
<script src="../../JS/credits-system.js"></script>
<!-- Your tool script comes after -->
<script src="../tools/your-tool.html"></script>
```

### Issue: PDF downloads but won't open
**Solution**: Ensure jsPDF and html2canvas are loaded
```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
```

### Issue: iOS shows preview instead of download
**Solution**: This is now fixed by PDF manager! Make sure you're using:
```javascript
await window.pdfDownloadManager.downloadPDF(element, filename)
```

### Issue: Credits reset prematurely
**Solution**: Check browser timezone. System uses UTC dates.
Server-side synchronization coming in future version.

### Issue: Styled elements look wrong in PDF
**Solution**: html2canvas may not capture all styles. Use inline styles:
```html
<!-- Good for PDF export -->
<div style="background: blue; color: white;">Content</div>

<!-- May not export well -->
<div class="my-class">Content</div><!-- where .my-class uses CSS -->
```

---

## Advanced Customization

### Custom Daily Limit

To use different credit limits per tool:

```javascript
// In your tool
const toolCredits = new CreditsManager('my-tool-name');
toolCredits.dailyLimit = 20; // Custom limit

// Access it
if (toolCredits.hasCredits(1)) {
    // proceed
}
```

### Custom Export Settings

```javascript
// In your tool
const customPdfManager = new PDFDownloadManager({
    scale: 1,           // Lower = faster
    backgroundColor: '#f5f5f5',  // Custom background
    quality: 0.85       // Lower = smaller file
});

const success = await customPdfManager.downloadPDF(element, 'file.pdf');
```

---

## Files to Update (Priority Order)

1. ✅ `tools/cv-builder.html` - DONE
2. ⭕ `tools/invoice-generator.html` - PDF with credits
3. ⭕ `tools/image-to-pdf.html` - PDF with credits (high priority)
4. ⭕ `tools/password-generator.html` - Display credits, simple export
5. ⭕ `tools/expense-tracker.html` - PDF export with credits
6. ⭕ `tools/salary-calculator.html` - PDF export with credits
7. ⭕ `tools/study-planner.html` - PDF/Image export with credits
8. ⭕ `tools/qr-code-generator.html` - Image download with credits
9. ⭕ `tools/barcode-generator.html` - Image download with credits
10. ⭕ `tools/task-manager.html` - Export task list with credits
11. ⭕ `tools/text-tools.html` - Export text with credits
12. ⭕ `tools/color-palette.html` - Export colors with credits
13. ⭕ `tools/pomodoro-timer.html` - Export stats with credits
14. ⭕ `tools/timesheet-tracker.html` - PDF export with credits
15. ⭕ `tools/unit-converter.html` - Export conversions with credits

---

**Estimated Time per Tool**: 5-15 minutes
**Total Estimated Time**: 2-3 hours for all tools

---

For questions or issues, contact:
📧 info@linetechsoftwares.co.za
📞 +27 71 183 1818
🌐 linetechsoftwares.co.za

**Happy integrating! 🎉**

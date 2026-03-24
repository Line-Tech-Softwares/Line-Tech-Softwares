// Shared utilities for all tools
// Includes preview updates, export functions, and common UI interactions

/* ============= Preview & Update Functions ============= */

function setupLivePreview(inputSelectors, updateFunction) {
    inputSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
            el.addEventListener('input', updateFunction);
            el.addEventListener('change', updateFunction);
        });
    });
}

function updatePreview() {
    // Generic function - override in specific tools
    console.log('Preview updated');
}

/* ============= Export Functions ============= */

// Export as PDF using html2pdf library
function exportPDF(filename, element) {
    const opt = {
        margin: 10,
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    if (window.html2pdf) {
        html2pdf().set(opt).from(element).save();
    } else {
        alert('PDF library not loaded. Please try again.');
    }
}

// Export as CSV
function exportCSV(filename, data) {
    const csv = convertToCSV(data);
    downloadFile(csv, filename, 'text/csv');
}

// Convert array/object to CSV format
function convertToCSV(data) {
    if (Array.isArray(data)) {
        if (data.length === 0) return '';
        
        // Get headers
        const headers = Object.keys(data[0]);
        const csv = [headers.join(',')];
        
        // Get rows
        data.forEach(row => {
            const values = headers.map(header => {
                const value = row[header];
                // Escape quotes and wrap in quotes if contains comma
                if (value === null || value === undefined) return '';
                const str = String(value);
                if (str.includes(',') || str.includes('"')) {
                    return `"${str.replace(/"/g, '""')}"`;
                }
                return str;
            });
            csv.push(values.join(','));
        });
        
        return csv.join('\n');
    }
    return '';
}

// Download file utility
function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

// Export as JSON
function exportJSON(filename, data) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
}

/* ============= Text Utilities ============= */

function countWords(text) {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
}

function countCharacters(text, includeSpaces = true) {
    if (includeSpaces) return text.length;
    return text.replace(/\s/g, '').length;
}

function caseConvert(text, caseType) {
    switch (caseType) {
        case 'upper':
            return text.toUpperCase();
        case 'lower':
            return text.toLowerCase();
        case 'title':
            return text.replace(/\b\w/g, char => char.toUpperCase());
        case 'sentence':
            return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        case 'toggle':
            return text.replace(/\S/g, char => 
                char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
            );
        default:
            return text;
    }
}

function reverseText(text) {
    return text.split('').reverse().join('');
}

function removeExtraSpaces(text) {
    return text.replace(/\s+/g, ' ').trim();
}

/* ============= Number Utilities ============= */

function formatCurrency(value, currency = 'ZAR') {
    const formatter = new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: currency
    });
    return formatter.format(value);
}

function formatNumber(value, decimals = 2) {
    return parseFloat(value).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function percentageChange(oldVal, newVal) {
    return ((newVal - oldVal) / oldVal) * 100;
}

/* ============= Date Utilities ============= */

function getFormattedDate(date = new Date()) {
    const d = new Date(date);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
}

function getFormattedTime(date = new Date()) {
    return date.toLocaleTimeString('en-ZA');
}

function getDaysDifference(date1, date2) {
    const time = Math.abs(date2 - date1);
    return Math.ceil(time / (1000 * 60 * 60 * 24));
}

/* ============= Validation ============= */

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
    return re.test(phone);
}

function validateURL(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/* ============= Color Utilities ============= */

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('').toUpperCase();
}

function generateRandomColor() {
    return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
}

function getLuminance(r, g, b) {
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function getContrastColor(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '#000000';
    const luminance = getLuminance(rgb.r, rgb.g, rgb.b);
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

/* ============= Local Storage ============= */

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

function getFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Storage error:', e);
        return null;
    }
}

function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (e) {
        console.error('Storage error:', e);
        return false;
    }
}

/* ============= UI Helpers ============= */

function showNotification(message, type = 'info', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#22c55e' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copied to clipboard!', 'success', 2000);
    }).catch(() => {
        showNotification('Failed to copy', 'error', 2000);
    });
}

/* ============= Animations ============= */

const slideInOutStyles = document.createElement('style');
slideInOutStyles.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(slideInOutStyles);

/* ============= Currency Conversion Values (SA focused) ============= */

const currencyRates = {
    ZAR: 1,
    USD: 0.054,
    EUR: 0.050,
    GBP: 0.043,
    INR: 4.45,
    NGN: 50.5
};

function convertCurrency(amount, fromCurrency, toCurrency) {
    const amountInUSD = amount / currencyRates[fromCurrency];
    return amountInUSD * currencyRates[toCurrency];
}

/* ============= Unit Conversion ============= */

const unitConversions = {
    length: {
        m: 1,
        km: 0.001,
        cm: 100,
        mm: 1000,
        mi: 0.000621371,
        yd: 1.09361,
        ft: 3.28084,
        in: 39.3701
    },
    weight: {
        kg: 1,
        g: 1000,
        mg: 1000000,
        t: 0.001,
        lb: 2.20462,
        oz: 35.274
    },
    volume: {
        L: 1,
        mL: 1000,
        m3: 0.001,
        gal: 0.264172,
        pt: 2.11338
    }
};

function convertUnit(value, fromUnit, toUnit, category) {
    if (!unitConversions[category]) return value;
    const baseValue = value / unitConversions[category][fromUnit];
    return baseValue * unitConversions[category][toUnit];
}

// End of tool-utils.js

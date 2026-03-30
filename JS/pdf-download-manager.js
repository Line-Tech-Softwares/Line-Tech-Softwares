/**
 * Mobile-Optimized PDF Download Utility
 * Handles PDF downloads across all platforms including iOS
 * Features: iOS fix, data URL export, blob fallback, complete data preservation
 */

class PDFDownloadManager {
    constructor(options = {}) {
        this.options = {
            scale: 2,
            backgroundColor: '#ffffff',
            quality: 0.95,
            ...options
        };
    }

    /**
     * Download PDF with automatic platform detection
     * @param {HTMLElement} element - Element to convert to PDF
     * @param {string} filename - Name for the PDF file
     * @returns {Promise<boolean>} - Success status
     */
    async downloadPDF(element, filename = 'document.pdf') {
        try {
            // Ensure filename has .pdf extension
            if (!filename.endsWith('.pdf')) {
                filename += '.pdf';
            }

            // Check platform and use appropriate method
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            const isAndroid = /Android/.test(navigator.userAgent);
            
            let success = false;
            
            if (isIOS) {
                success = await this._downloadPDFiOS(element, filename);
            } else if (isAndroid) {
                success = await this._downloadPDFAndroid(element, filename);
            } else {
                success = await this._downloadPDFDesktop(element, filename);
            }

            return success;
        } catch (error) {
            console.error('PDF Download Error:', error);
            return false;
        }
    }

    /**
     * Desktop download - Standard approach
     */
    async _downloadPDFDesktop(element, filename) {
        try {
            const canvas = await html2canvas(element, {
                scale: this.options.scale,
                backgroundColor: this.options.backgroundColor,
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            
            heightLeft -= (pdf.internal.pageSize.getHeight() - 20);
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }

            pdf.save(filename);
            return true;
        } catch (error) {
            console.error('Desktop PDF download failed:', error);
            return false;
        }
    }

    /**
     * iOS Download - Uses blob and special handling
     */
    async _downloadPDFiOS(element, filename) {
        try {
            const canvas = await html2canvas(element, {
                scale: this.options.scale,
                backgroundColor: this.options.backgroundColor,
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            // Convert to blob
            const blob = pdf.output('blob');
            
            // iOS-specific: Use download attribute with blob URL
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);

            return true;
        } catch (error) {
            console.error('iOS PDF download failed:', error);
            // Fallback to alternative method
            return await this._downloadPDFAlternative(element, filename);
        }
    }

    /**
     * Android Download - Optimized for Android browsers
     */
    async _downloadPDFAndroid(element, filename) {
        try {
            const canvas = await html2canvas(element, {
                scale: this.options.scale,
                backgroundColor: this.options.backgroundColor,
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            // Android: Use save method directly
            pdf.save(filename);
            return true;
        } catch (error) {
            console.error('Android PDF download failed:', error);
            return false;
        }
    }

    /**
     * Alternative download method - For browsers with download restrictions
     */
    async _downloadPDFAlternative(element, filename) {
        try {
            const canvas = await html2canvas(element, {
                scale: this.options.scale,
                backgroundColor: this.options.backgroundColor,
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            // Get PDF as data URL
            const pdfDataUrl = pdf.output('datauristring');
            
            // Open in new window (iOS fallback)
            const newWindow = window.open(pdfDataUrl);
            if (newWindow) {
                newWindow.print();
                return true;
            }
            
            return false;
        } catch (error) {
            console.error('Alternative PDF download failed:', error);
            return false;
        }
    }

    /**
     * Export as image instead (fallback)
     */
    async downloadAsImage(element, filename = 'export.png') {
        try {
            const canvas = await html2canvas(element, {
                scale: this.options.scale,
                backgroundColor: this.options.backgroundColor,
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            return true;
        } catch (error) {
            console.error('Image download failed:', error);
            return false;
        }
    }

    /**
     * Get PDF as blob (for API uploads, etc)
     */
    async getPDFBlob(element) {
        try {
            const canvas = await html2canvas(element, {
                scale: this.options.scale,
                backgroundColor: this.options.backgroundColor,
                logging: false,
                useCORS: true,
                allowTaint: true
            });

            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            
            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);

            return pdf.output('blob');
        } catch (error) {
            console.error('Error generating PDF blob:', error);
            return null;
        }
    }
}

// Global instance
window.pdfDownloadManager = new PDFDownloadManager();

/**
 * Helper function for quick PDF download
 */
async function downloadElementAsPDF(elementId, filename = 'document.pdf') {
    const element = document.getElementById(elementId);
    if (!element) {
        showNotification('❌ Element not found', 'error');
        return false;
    }

    try {
        const success = await window.pdfDownloadManager.downloadPDF(element, filename);
        if (success) {
            showNotification('✅ PDF downloaded successfully!', 'success');
            return true;
        } else {
            showNotification('❌ Download failed. Try again.', 'error');
            return false;
        }
    } catch (error) {
        console.error('Download error:', error);
        showNotification('❌ Error during download', 'error');
        return false;
    }
}

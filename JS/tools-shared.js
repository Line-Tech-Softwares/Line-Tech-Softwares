// Shared Tools Logic - For all tool pages

// LocalStorage keys
const STORAGE = {
    uses: 'lts-tools-uses',
    plan: 'lts-plan',
    account: 'lts-account-email'
};

// Get/Set storage
const getUses = () => parseInt(localStorage.getItem(STORAGE.uses) || '0');
const setUses = (count) => localStorage.setItem(STORAGE.uses, count.toString());
const getPlan = () => localStorage.getItem(STORAGE.plan) || 'free';
const setPlan = (plan) => localStorage.setItem(STORAGE.plan, plan);

// Increment uses
const incrementUses = () => {
    const uses = getUses() + 1;
    setUses(uses);
    return uses;
};

// Check if needs upgrade
const needsUpgrade = (uses) => uses >= 3 && getPlan() === 'free';

// Show thank-you modal
const showThankYou = (toolName, plan = getPlan()) => {
    let title = 'Thank you!';
    let message = '';
    let hook = '';

    if (plan === 'free') {
        if (needsUpgrade(incrementUses())) {
            title = 'Upgrade Time!';
            message = `You&#39;ve used ${getUses()}/3 free downloads. Unlock unlimited!`;
            hook = 'Make account (10/day free) or R10 once-off / R29/month.';
        } else {
            message = 'Great job! Generated your document.';
        }
    } else if (plan === 'onceoff') {
        title = 'Premium Thank You!';
        message = 'Enjoy your once-off unlimited download.';
    } else if (plan === 'sub') {
        title = 'VIP Subscriber!';
        message = 'Unlimited access - thank you for supporting LTS!';
    }

    // Business hook
    hook += '<br><strong>Need this automated for business? Let&#39;s build custom.</strong>';

    // Modal HTML (inject)
    const modal = `
        <div id="thankyou-modal" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:9999;display:flex;align-items:center;justify-content:center;">
            <div style="background:#1f2937;border-radius:20px;padding:3rem;max-width:500px;width:90%;text-align:center;color:white;">
                <h2 style="color:#00d4c8;margin-bottom:1rem;">${title}</h2>
                <p>${message}</p>
                <p>${hook}</p>
                <div style="margin-top:2rem;">
                    <button onclick="purchasePlan('onceoff')" style="background:#3b82f6;color:white;border:none;padding:1rem 2rem;border-radius:10px;margin:0 0.5rem;cursor:pointer;">R10 Once-off</button>
                    <button onclick="purchasePlan('sub')" style="background:#10b981;color:white;border:none;padding:1rem 2rem;border-radius:10px;margin:0 0.5rem;cursor:pointer;">R29/Month</button>
                    <button onclick="signupAccount()" style="background:#6b7280;color:white;border:none;padding:1rem 2rem;border-radius:10px;margin-left:0.5rem;cursor:pointer;">Make Account</button>
                    <button onclick="closeThankYou()" style="background:transparent;color:#00d4c8;border:2px solid #00d4c8;padding:1rem 2rem;border-radius:10px;margin-left:0.5rem;cursor:pointer;">Close</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
};

// Placeholder purchase/signup (for now - link to contact)
function purchasePlan(plan) {
    setPlan(plan);
    closeThankYou();
    window.location.href = '../index.html#contact';
}

function signupAccount() {
    const email = prompt('Enter email for 10 free/day account (agrees to LTS emails):');
    if (email) {
        localStorage.setItem(STORAGE.account, email);
        setPlan('account');
        closeThankYou();
    }
}

function closeThankYou() {
    document.getElementById('thankyou-modal').remove();
}

// PDF Generation (requires jsPDF CDN on page)
async function generatePDF(previewId, filename = 'document.pdf') {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();
    const element = document.getElementById(previewId);
    
    try {
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
        }
        
        pdf.save(filename);
        showThankYou('Your Tool');
    } catch (e) {
        alert('PDF generation failed. Try again.');
    }
}

// CSV Export
function exportCSV(data, filename = 'data.csv') {
    const csv = 'data:text/csv;charset=utf-8,' + data.map(row => row.join(',')).join('\\n');
    const link = document.createElement('a');
    link.href = csv;
    link.download = filename;
    link.click();
    incrementUses();
    showThankYou('Your CSV');
}

// Init for tool pages
function initTool(toolName) {
    // Load libs if not present
    if (typeof jsPDF === 'undefined') {
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        document.head.appendChild(script1);
        
        const script2 = document.createElement('script');
        script2.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        document.head.appendChild(script2);
        
        script2.onload = () => console.log('Libs loaded for', toolName);
    }
}

// Export on button click example
// document.getElementById('export-pdf').addEventListener('click', () => generatePDF('preview', 'cv.pdf'));


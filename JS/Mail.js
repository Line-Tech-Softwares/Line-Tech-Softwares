// JS/Mail.js

const form = document.getElementById('form') || document.querySelector("#contact-form");
const submitBtn = form ? form.querySelector("button[type='submit']") : null;
let lastSubmits = []; // timestamps for throttle

// Create inline message for validation & slow connection
const warningMessage = document.createElement("div");
warningMessage.className = "form-message warning-message";
warningMessage.innerHTML = `<div class="message-icon">
<i class="fas fa-exclamation-triangle"></i>
</div>
<div class="message-content">
<h4>Notice</h4>
<p id="warning-text"></p>
</div>`;
// attach messages near the form (fallback if form not found)
if (form && form.parentElement) form.parentElement.prepend(warningMessage);
else document.body.prepend(warningMessage);
warningMessage.style.display = "none";
const warningText = document.getElementById("warning-text");

// No-network / offline screen
const noNetworkScreen = document.createElement('div');
noNetworkScreen.id = 'no-network-screen';
noNetworkScreen.style.cssText = 'display:none;position:fixed;inset:0;background:rgba(0,0,0,0.8);color:#fff;z-index:9999;align-items:center;justify-content:center;flex-direction:column;text-align:center;padding:20px;';
noNetworkScreen.innerHTML = `<div style="max-width:540px;"><h2>No network connection</h2><p>Please check your internet connection and try again.</p><button id="no-network-retry" style="margin-top:12px;padding:8px 16px;">Retry</button></div>`;
document.body.appendChild(noNetworkScreen);

function showNoNetwork(show = true) {
    noNetworkScreen.style.display = show ? 'flex' : 'none';
}

window.addEventListener('offline', () => showNoNetwork(true));
window.addEventListener('online', () => showNoNetwork(false));
document.getElementById('no-network-retry').addEventListener('click', () => {
    if (navigator.onLine) showNoNetwork(false);
});

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    warningMessage.style.display = "none"; // reset

    const now = Date.now();
    lastSubmits = lastSubmits.filter(ts => now - ts < 30000);

    if (lastSubmits.length >= 2) {
        warningText.textContent = "You can only send 2 messages every 30 seconds. Please wait.";
        warningMessage.style.display = "block";
        return;
    }

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phone = document.querySelector("#phone").value.trim();
    const service = document.querySelector("#service").value;
    const message = document.querySelector("#message").value.trim();

    // Validation
    if (!name || !email || !phone) {
        warningText.textContent = "Please fill in all required fields.";
        warningMessage.style.display = "block";
        return;
    }

    if (name.split(" ").length < 2) {
        warningText.textContent = "Please enter your full name (at least 2 words).";
        warningMessage.style.display = "block";
        return;
    }

    if (!/^(?:[6-8][0-9]{8}|0[6-8][0-9]{8}|\+27[6-8][0-9]{8})$/.test(phone.replace(/\s+/g, ""))) {
        warningText.textContent = "Please enter a valid South African phone number.";
        warningMessage.style.display = "block";
        return;
    }

    if (!/(?:@gmail\.com|@icloud\.com)$/i.test(email)) {
        warningText.textContent = "Please use a Gmail or iCloud email only.";
        warningMessage.style.display = "block";
        return;
    }

    lastSubmits.push(now);

    // Button / spinner handling (preserve inner structure)
    const submitButton = submitBtn || (form.querySelector(".submit-button") || form.querySelector("button[type='submit']"));
    const buttonTextEl = submitButton ? submitButton.querySelector('.button-text') : null;
    const spinner = submitButton ? submitButton.querySelector("#loading-spinner") : null;
    const originalText = buttonTextEl ? buttonTextEl.textContent : (submitButton ? submitButton.textContent : '');
    if (submitButton) {
        if (buttonTextEl) buttonTextEl.textContent = "Sending...";
        else submitButton.textContent = "Sending...";
        submitButton.disabled = true;
        if (spinner) spinner.style.display = "inline-block";
    }

    // Slow connection warning inline
    const slowConnectionTimer = setTimeout(() => {
        warningText.textContent = "Your connection seems slow. Sending might take a little longer...";
        warningMessage.style.display = "block";
    }, 3000); // 3s

    try {
        // Use Web3Forms submit with FormData + access_key
        const formData = new FormData(form);
        formData.append("access_key", "066c5fad-6842-4c89-87e8-a1fd5bfb99d0");

        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });

        const result = await response.json().catch(() => ({}));
        if (spinner) spinner.style.display = "none";
        clearTimeout(slowConnectionTimer);
        warningMessage.style.display = "none";

        if (response.ok) {
            document.querySelector("#success-message").style.display = "block";
            document.querySelector("#error-message").style.display = "none";
            form.reset();
        } else {
            document.querySelector("#success-message").style.display = "none";
            document.querySelector("#error-message").style.display = "block";
            warningText.textContent = result.message || "Something went wrong. Please try again.";
            warningMessage.style.display = "block";
        }
    } catch (err) {
        if (spinner) spinner.style.display = "none";
        clearTimeout(slowConnectionTimer);
        document.querySelector("#success-message").style.display = "none";
        document.querySelector("#error-message").style.display = "block";
        // Show inline warning and overlay for no network
        if (!navigator.onLine) {
            showNoNetwork(true);
            warningText.textContent = "No network connection. Please check your internet.";
        } else {
            warningText.textContent = "Network error or server unreachable. Please try again later.";
        }
        warningMessage.style.display = "block";
        console.error(err);
    }
    finally {
        if (submitButton) {
            if (buttonTextEl) buttonTextEl.textContent = originalText;
            else submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }
});
//Kabelo Kgosana: 05 January 2026
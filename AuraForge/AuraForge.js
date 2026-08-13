/**
 * AuraForge Web App Interactive Script
 */


//clearing .html
document.addEventListener('DOMContentLoaded', () => {
    // 1. Instantly clean '.html' from the URL without triggering a page reload
    cleanUrlPath();
  wireDownloadButtons();
});

/**
 * URL Cleaner: Removes .html extensions seamlessly from address bar
 */
function cleanUrlPath() {
    const windowLocation = window.location;
    if (windowLocation.protocol === 'file:') return; // Guard for local file inspection

    let path = windowLocation.pathname;
    if (path.endsWith('.html')) {
        const cleanPath = path.substring(0, path.length - 5); // Strip '.html'
        window.history.replaceState(null, '', cleanPath + windowLocation.search + windowLocation.hash);
    }
};

// Dynamic Feature Modal Contents
const featureDetails = [
  {
    title: "Goals System",
    description: "Break down long-term visions into monthly milestones. Track your daily habits and convert standard progress into visual aura flames that evolve over time."
  },
  {
    title: "Tasks & Deadlines",
    description: "Manage complex projects with dynamic priority tags. Completing tasks boosts your Aura score, while missed deadlines dim your flame."
  },
  {
    title: "Aura System",
    description: "Your gamified focus score starts at 50 points. Maintain high performance to unlock new tiers—ranging from Burnt Ember up to Inferno."
  },
  {
    title: "Streak Tracking",
    description: "Build unstoppable momentum with flexible habit triggers. Visual flame indicators grow brighter with every consecutive day completed."
  },
  {
    title: "Private Journal",
    description: "End-to-end encrypted daily logging featuring automated mood analytics and customizable reflection prompts."
  },
  {
    title: "Visual Planning",
    description: "Organize your workflow using interactive time-blocking calendars. Includes seamless PDF and iCal exports."
  }
];

// FAQ Data Setup
const faqData = [
  {
    question: "Is AuraForge really 100% free?",
    answer: "Yes, AuraForge is entirely free with no ads, trackers, or hidden subscription costs. It is funded strictly via optional community donations."
  },
  {
    question: "Which platforms are supported?",
    answer: "AuraForge is available as a native desktop application for Windows, macOS, and Linux."
  },
  {
    question: "Is my journal data private?",
    answer: "Your privacy is paramount. All notes and journal logs are encrypted locally on your machine before saving."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Navigation Toggle
  const mobileBtn = document.querySelector(".mobile-menu-btn");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener("click", () => {
      const isVisible = mobileMenu.style.display === "block";
      mobileMenu.style.display = isVisible ? "none" : "block";
    });
  }

  // Populate FAQ Accordions
  const faqContainer = document.getElementById("faqContainer");
  if (faqContainer) {
    faqData.forEach((item) => {
      const faqElem = document.createElement("div");
      faqElem.className = "faq-item";
      faqElem.innerHTML = `
        <div class="faq-question">
          <span>${item.question}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        <div class="faq-answer">${item.answer}</div>
      `;

      faqElem.querySelector(".faq-question").addEventListener("click", () => {
        const answer = faqElem.querySelector(".faq-answer");
        const icon = faqElem.querySelector("i");
        const isOpen = answer.style.display === "block";

        answer.style.display = isOpen ? "none" : "block";
        icon.className = isOpen ? "fas fa-chevron-down" : "fas fa-chevron-up";
      });

      faqContainer.appendChild(faqElem);
    });
  }

  // Back to Top Button Control
  const backToTopBtn = document.getElementById("backToTop");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.style.display = "flex";
    } else {
      backToTopBtn.style.display = "none";
    }
  });

  // Contact Form Submission Handling
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for reaching out! Your message has been sent.");
      contactForm.reset();
    });
  }
});

// App Download Action
function downloadApp() {
  // legacy fallback — open download modal for platform choices
  showDownloadOptions();
}

// Wire header and modal download buttons
function wireDownloadButtons() {
  const headerBtn = document.getElementById('headerDownloadBtn');
  if (headerBtn) headerBtn.addEventListener('click', showDownloadOptions);

  const winBtn = document.getElementById('winDownload');
  const linuxBtn = document.getElementById('linuxDownload');

    if (winBtn) {
    winBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // link directly to the distributed Windows installer inside the Dist folder
      const url = encodeURI('Dist/AuraForge Setup 0.1.2.exe');
      window.location.href = url;
    });
  }

  if (linuxBtn) {
    linuxBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = '/downloads/AuraForge-1.0.AppImage';
      window.location.href = url;
    });
  }

  const bugForm = document.getElementById('bugReportForm');
  if (bugForm) {
    bugForm.addEventListener('submit', (e) => {
      // let form submit to web3forms; show a quick client-side acknowledgement
      setTimeout(() => {
        alert('Thanks — bug report submitted. We appreciate the details.');
        bugForm.reset();
      }, 300);
    });
  }
}

// Show download modal with platform choices and mobile handling
function showDownloadOptions() {
  const isMobile = /Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent) || window.innerWidth < 900;
  const modal = document.getElementById('downloadModal');
  const downloadNote = document.getElementById('downloadNote');
  if (!modal) return;

  if (isMobile) {
    // on mobile/tablet, disable downloads and show note
    downloadNote.style.display = 'block';
    document.getElementById('winDownload').style.pointerEvents = 'none';
    document.getElementById('linuxDownload').style.pointerEvents = 'none';
    document.getElementById('winDownload').style.opacity = '0.6';
    document.getElementById('linuxDownload').style.opacity = '0.6';
  } else {
    downloadNote.style.display = 'none';
    document.getElementById('winDownload').style.pointerEvents = '';
    document.getElementById('linuxDownload').style.pointerEvents = '';
    document.getElementById('winDownload').style.opacity = '';
    document.getElementById('linuxDownload').style.opacity = '';
  }

  modal.style.display = 'flex';
}

function closeDownloadModal() {
  const modal = document.getElementById('downloadModal');
  if (modal) modal.style.display = 'none';
}

// Display Feature Details Modal
function showFeatureModal(index) {
  const feature = featureDetails[index];
  if (!feature) return;

  const modal = document.getElementById("featureModal");
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
    <h2 style="color: var(--primary-orange); margin-bottom: 1rem;">${feature.title}</h2>
    <p style="color: var(--text-muted); line-height: 1.6;">${feature.description}</p>
  `;

  modal.style.display = "flex";
}

// Display Privacy or Terms Modals
function showPage(pageType) {
  const modal = document.getElementById("pageModal");
  const pageContent = document.getElementById("page-content");

  if (pageType === "privacy") {
    pageContent.innerHTML = `
      <h2>Privacy Policy</h2>
      <p style="margin-top: 1rem; color: var(--text-muted);">AuraForge respects your data. We do not track user analytics, harvest personal information, or sell data to third parties. All personal metrics stay stored locally on your device.</p>
    `;
  } else if (pageType === "terms") {
    pageContent.innerHTML = `
      <h2>Terms of Service</h2>
      <p style="margin-top: 1rem; color: var(--text-muted);">AuraForge is provided "as-is" without warranty of any kind. You are free to use this application for personal or commercial productivity workflows.</p>
    `;
  }

  modal.style.display = "flex";
}

// Donation Placeholder Action
function fakeDonate(tier) {
  alert(`Thank you for considering supporting AuraForge with the ${tier} tier! Direct donation portals will open soon.`);
}

// Close Active Modals
function closeModal() {
  document.getElementById("featureModal").style.display = "none";
  document.getElementById("pageModal").style.display = "none";
}

// Smooth Scroll to Top
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Close Modals when Clicking Overlay
window.onclick = function (event) {
  const featureModal = document.getElementById("featureModal");
  const pageModal = document.getElementById("pageModal");
  const downloadModal = document.getElementById("downloadModal");
  if (event.target === featureModal) featureModal.style.display = "none";
  if (event.target === pageModal) pageModal.style.display = "none";
  if (downloadModal && event.target === downloadModal) downloadModal.style.display = "none";
};
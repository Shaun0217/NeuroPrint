// NeuroPrint Global Client Interactions

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll animation (subtle header border/shadow styling)
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        header.style.boxShadow = '0 4px 20px rgba(12, 18, 34, 0.1)';
      } else {
        header.style.boxShadow = 'none';
      }
    });
  }

  // 2. Setup intersection observer for counter elements
  setupCounters();
});

// Mobile menu drawer toggle
function toggleMenu() {
  const menuOverlay = document.getElementById('menu-overlay');
  const menuToggle = document.getElementById('menu-toggle');

  if (!menuOverlay || !menuToggle) return;

  // Inject backdrop element once
  let backdrop = document.getElementById('menu-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'menu-backdrop';
    document.body.appendChild(backdrop);
    backdrop.addEventListener('click', () => closeMenu());
  }

  const isActive = menuOverlay.classList.contains('active');

  if (isActive) {
    closeMenu();
  } else {
    menuOverlay.classList.add('active');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
    menuToggle.innerHTML = '✕';
    menuToggle.setAttribute('aria-expanded', 'true');
    // Close when any nav link inside the overlay is tapped
    menuOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => closeMenu(), { once: true });
    });
  }
}

function closeMenu() {
  const menuOverlay = document.getElementById('menu-overlay');
  const menuToggle = document.getElementById('menu-toggle');
  const backdrop = document.getElementById('menu-backdrop');

  if (menuOverlay) menuOverlay.classList.remove('active');
  if (backdrop) backdrop.classList.remove('active');
  document.body.style.overflow = '';
  if (menuToggle) {
    menuToggle.innerHTML = '☰';
    menuToggle.setAttribute('aria-expanded', 'false');
  }
}

// Global counters handler using Intersection Observer
function setupCounters() {
  const counters = document.querySelectorAll('.counter');
  if (counters.length === 0) return;
  
  const options = { threshold: 0.3 };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target') || '0', 10);
        let count = 0;
        const duration = 1200; // 1.2 seconds for fluid visual counting
        const stepTime = Math.max(Math.floor(duration / target), 15);
        
        const timer = setInterval(() => {
          count += Math.ceil(target / (duration / stepTime));
          if (count >= target) {
            counter.innerText = target;
            clearInterval(timer);
          } else {
            counter.innerText = count;
          }
        }, stepTime);
        
        observer.unobserve(counter);
      }
    });
  }, options);
  
  counters.forEach(counter => observer.observe(counter));
}

// Custom solid museum modal dialog system (Replaces window.alert)
function showCustomAlert(title, message, btnText = 'Acknowledge', callback = null) {
  let modalBackdrop = document.querySelector('.custom-modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
  
  modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'custom-modal-backdrop';
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal'; // Flat, solid white with thin borders
  
  modal.innerHTML = `
    <h3>${title}</h3>
    <p>${message}</p>
    <button class="btn btn-primary" style="padding: 10px 24px; font-size: 0.9rem; width: 100%;">${btnText}</button>
  `;
  
  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);
  
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  const dismissBtn = modal.querySelector('button');
  dismissBtn.addEventListener('click', () => {
    modalBackdrop.style.opacity = '0';
    modalBackdrop.style.transition = 'opacity 0.15s ease';
    setTimeout(() => {
      modalBackdrop.remove();
      document.body.style.overflow = prevOverflow;
      if (callback) callback();
    }, 150);
  });
}

// Custom solid museum prompt dialog system (Replaces window.prompt)
function showCustomPrompt(title, message, placeholder = '', confirmText = 'Submit', callback = null) {
  let modalBackdrop = document.querySelector('.custom-modal-backdrop');
  if (modalBackdrop) modalBackdrop.remove();
  
  modalBackdrop = document.createElement('div');
  modalBackdrop.className = 'custom-modal-backdrop';
  
  const modal = document.createElement('div');
  modal.className = 'custom-modal';
  modal.style.maxWidth = '450px';
  
  modal.innerHTML = `
    <h3>${title}</h3>
    <p style="margin-bottom: 20px;">${message}</p>
    <div class="form-group" style="margin-bottom: 25px;">
      <input type="text" class="form-control" id="custom-prompt-input" placeholder="${placeholder}" autocomplete="off">
    </div>
    <div style="display: flex; gap: 12px; justify-content: flex-end; width: 100%;">
      <button class="btn btn-secondary" id="prompt-cancel-btn" style="padding: 10px 20px; font-size: 0.9rem;">Cancel</button>
      <button class="btn btn-primary" id="prompt-confirm-btn" style="padding: 10px 20px; font-size: 0.9rem;">${confirmText}</button>
    </div>
  `;
  
  modalBackdrop.appendChild(modal);
  document.body.appendChild(modalBackdrop);
  
  const input = modal.querySelector('#custom-prompt-input');
  input.focus();
  
  const prevOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';
  
  const close = (val) => {
    modalBackdrop.style.opacity = '0';
    modalBackdrop.style.transition = 'opacity 0.15s ease';
    setTimeout(() => {
      modalBackdrop.remove();
      document.body.style.overflow = prevOverflow;
      if (callback) callback(val);
    }, 150);
  };
  
  modal.querySelector('#prompt-cancel-btn').addEventListener('click', () => close(null));
  modal.querySelector('#prompt-confirm-btn').addEventListener('click', () => close(input.value));
  
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      close(input.value);
    }
  });
}

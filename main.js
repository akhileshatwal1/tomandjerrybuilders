/* ==========================================================
   Singh Landscaping — main.js
   Handles: Mobile menu | FAQ accordion | Contact form email
   ========================================================== */

/* ── Active nav link highlight ───────────── */
(function() {
  var page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(function(a) {
    var href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

/* ── Mobile hamburger ─────────────────────── */
var hamBtn = document.getElementById('ham-btn');
var mainNav = document.getElementById('main-nav');
if (hamBtn && mainNav) {
  hamBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    mainNav.classList.toggle('open');
  });
  document.addEventListener('click', function(e) {
    if (!mainNav.contains(e.target) && e.target !== hamBtn) {
      mainNav.classList.remove('open');
    }
  });
}

/* ── FAQ accordion ────────────────────────── */
document.querySelectorAll('.faq-q').forEach(function(btn) {
  btn.addEventListener('click', function() {
    var ans = this.nextElementSibling;
    var isOpen = this.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-q').forEach(function(b) {
      b.classList.remove('open');
      b.nextElementSibling.classList.remove('open');
    });
    // Open this one if it was closed
    if (!isOpen) {
      this.classList.add('open');
      ans.classList.add('open');
    }
  });
});

/* ── Gallery lightbox ─────────────────────── */
document.querySelectorAll('.g-item').forEach(function(item) {
  item.addEventListener('click', function() {
    var src = this.dataset.full || this.style.backgroundImage.replace(/url\(["']?|["']?\)/g,'');
    if (!src) return;
    var ov = document.createElement('div');
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
    var img = document.createElement('img');
    img.src = src;
    img.style.cssText = 'max-width:90vw;max-height:90vh;border-radius:4px;box-shadow:0 0 40px rgba(0,0,0,.8);';
    ov.appendChild(img);
    ov.addEventListener('click', function() { document.body.removeChild(ov); });
    document.body.appendChild(ov);
  });
});

/* ── Contact form — EmailJS ───────────────────────────────────────
   HOW TO ACTIVATE REAL EMAIL SENDING (free, no server needed):
   1. Go to https://emailjs.com and create a free account
   2. Add a service (Gmail) → copy the SERVICE ID
   3. Create a template with these variables:
      {{from_name}}, {{from_email}}, {{phone}}, {{service_type}}, {{message}}
      → copy the TEMPLATE ID
   4. Go to Account > API Keys → copy your PUBLIC KEY
   5. Replace the three values below
   ──────────────────────────────────────────────────────────────── */
var EJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← paste here
var EJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← paste here
var EJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← paste here

if (typeof emailjs !== 'undefined' && EJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init(EJS_PUBLIC_KEY);
}

var form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var btn    = this.querySelector('.btn-submit');
    var msgBox = document.getElementById('form-msg');
    var data   = {
      first_name:   this.querySelector('[name=first_name]').value.trim(),
      last_name:    this.querySelector('[name=last_name]').value.trim(),
      email:        this.querySelector('[name=email]').value.trim(),
      phone:        this.querySelector('[name=phone]').value.trim(),
      service_type: this.querySelector('[name=service]').value || 'Not specified',
      message:      this.querySelector('[name=message]').value.trim() || '(none)'
    };
    msgBox.className = 'form-msg';

    if (!data.first_name || !data.last_name || !data.email || !data.phone) {
      msgBox.textContent = '⚠ Please fill in all required fields.';
      msgBox.classList.add('error');
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Sending…';

    var params = {
      from_name:    data.first_name + ' ' + data.last_name,
      from_email:   data.email,
      phone:        data.phone,
      service_type: data.service_type,
      message:      data.message
    };

    function onSuccess() {
      btn.disabled = false; btn.textContent = 'Send Message';
      form.reset();
      msgBox.textContent = '✅ Thank you! We will contact you shortly.';
      msgBox.classList.add('success');
      setTimeout(function() { msgBox.className = 'form-msg'; }, 7000);
    }
    function onError(err) {
      btn.disabled = false; btn.textContent = 'Send Message';
      console.error(err);
      msgBox.textContent = '❌ Could not send. Please call (718) 740-3068 directly.';
      msgBox.classList.add('error');
    }

    if (EJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      // Demo mode — simulate success
      setTimeout(onSuccess, 900);
    } else {
      emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, params).then(onSuccess, onError);
    }
  });
}

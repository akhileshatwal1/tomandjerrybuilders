/* ============================================================
   Tom & Jerry Builders — main.js
   All shared JS loaded by every page.
   ─────────────────────────────────────────────────────────
   SECTIONS:
   1. Mobile hamburger menu
   2. Scroll effects (shadow, active nav, scroll-to-top)
   3. Smooth anchor scrolling
   4. Animated stat counters
   5. Testimonials slider
   6. Gallery lightbox
   7. Fade-in on scroll (IntersectionObserver)
   8. FAQ accordion
   9. Contact form (EmailJS)
   ============================================================ */

/* ── 1. MOBILE HAMBURGER ─────────────────────────────────── */
(function () {
  var ham = document.getElementById('ham-btn');
  var mob = document.getElementById('mob-menu');
  if (!ham || !mob) return;

  ham.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = mob.classList.toggle('open');
    ham.innerHTML = open
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });

  document.addEventListener('click', function (e) {
    if (!mob.contains(e.target) && e.target !== ham) {
      mob.classList.remove('open');
      ham.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });

  mob.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      mob.classList.remove('open');
      ham.innerHTML = '<i class="fas fa-bars"></i>';
    });
  });
})();


/* ── 2. SCROLL EFFECTS ───────────────────────────────────── */
(function () {
  var navbar = document.getElementById('navbar');
  var stBtn  = document.getElementById('scroll-top');
  var navAs  = document.querySelectorAll('.nav-links a[href]');
  var sects  = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', function () {
    var y = window.scrollY;

    // Navbar shadow
    if (navbar) navbar.style.boxShadow = y > 40
      ? '0 4px 24px rgba(0,0,0,.15)' : '';

    // Scroll-to-top button
    if (stBtn) stBtn.classList.toggle('show', y > 500);

    // Active nav link highlight
    sects.forEach(function (s) {
      if (s.offsetTop - 90 <= y && s.offsetTop + s.offsetHeight - 90 > y) {
        navAs.forEach(function (a) { a.classList.remove('active'); });
        var al = document.querySelector('.nav-links a[href="#' + s.id + '"]');
        if (al) al.classList.add('active');
      }
    });
  }, { passive: true });

  // Highlight current page link on non-single-page sites
  var page = location.pathname.split('/').pop() || 'index.html';
  navAs.forEach(function (a) {
    var href = a.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();


/* ── 3. SMOOTH ANCHOR SCROLLING ─────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function (a) {
  a.addEventListener('click', function (e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

var stBtn = document.getElementById('scroll-top');
if (stBtn) stBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ── 4. ANIMATED STAT COUNTERS ───────────────────────────── */
(function () {
  var statsBar = document.querySelector('.stats-bar');
  if (!statsBar) return;
  var done = false;

  function runCounters() {
    if (done) return;
    done = true;
    statsBar.querySelectorAll('.stat-n[data-target]').forEach(function (el) {
      var target = +el.dataset.target;
      var step   = Math.ceil(target / 60);
      var n = 0;
      var t = setInterval(function () {
        n = Math.min(n + step, target);
        el.textContent = n + '+';
        if (n >= target) clearInterval(t);
      }, 22);
    });
  }

  new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) runCounters();
  }, { threshold: 0.3 }).observe(statsBar);
})();


/* ── 5. TESTIMONIALS SLIDER ──────────────────────────────── */
(function () {
  var track = document.getElementById('testi-track');
  if (!track) return;

  var dots  = document.querySelectorAll('.t-dot');
  var cards = track.querySelectorAll('.t-card');
  var cur   = 0;
  var auto;

  function cardWidth() {
    return cards.length ? cards[0].offsetWidth + 24 : 0;
  }
  function goTo(n) {
    cur = ((n % cards.length) + cards.length) % cards.length;
    track.style.transform = 'translateX(-' + cur * cardWidth() + 'px)';
    dots.forEach(function (d, i) { d.classList.toggle('on', i === cur); });
  }
  function start() { auto = setInterval(function () { goTo(cur + 1); }, 5000); }
  function stop()  { clearInterval(auto); }

  var nxt = document.getElementById('t-next');
  var prv = document.getElementById('t-prev');
  if (nxt) nxt.addEventListener('click', function () { stop(); goTo(cur + 1); start(); });
  if (prv) prv.addEventListener('click', function () { stop(); goTo(cur - 1); start(); });
  dots.forEach(function (d, i) {
    d.addEventListener('click', function () { stop(); goTo(i); start(); });
  });

  window.addEventListener('resize', function () { goTo(cur); }, { passive: true });
  start();
})();


/* ── 6. GALLERY LIGHTBOX ─────────────────────────────────── */
(function () {
  var lb    = document.getElementById('lightbox');
  var lbImg = document.getElementById('lb-img');
  var lbClose = document.getElementById('lb-close');
  if (!lb) return;

  document.querySelectorAll('.gal-item').forEach(function (item) {
    item.addEventListener('click', function () {
      var bgEl = this.querySelector('.gal-bg');
      if (!bgEl) return;
      var raw = bgEl.style.backgroundImage.replace(/url\(["']?|["']?\)/g, '');
      lbImg.src = raw.split('?')[0] + '?w=1400&q=90&auto=format';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLb() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  if (lbClose) lbClose.addEventListener('click', closeLb);
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
})();


/* ── 7. FADE-IN ON SCROLL ────────────────────────────────── */
(function () {
  // Inject the CSS once
  var style = document.createElement('style');
  style.textContent = '.fi{opacity:0;transform:translateY(28px);transition:opacity .55s ease,transform .55s ease}.fv{opacity:1;transform:none}';
  document.head.appendChild(style);

  var els = document.querySelectorAll(
    '.svc-card, .d-card, .t-card, .ci-item, .about-img-col, .about-text, .proj-card, .svc-list-card'
  );
  els.forEach(function (el) {
    el.classList.add('fi');
    new IntersectionObserver(function (entries, obs) {
      if (entries[0].isIntersecting) {
        el.classList.add('fv');
        obs.unobserve(el);
      }
    }, { threshold: 0.1 }).observe(el);
  });
})();


/* ── 8. FAQ ACCORDION ────────────────────────────────────── */
document.querySelectorAll('.faq-q').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var ans    = this.nextElementSibling;
    var isOpen = this.classList.contains('open');
    // Close all
    document.querySelectorAll('.faq-q').forEach(function (b) {
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


/* ── 9. CONTACT FORM (EmailJS) ───────────────────────────────────────────
   TO ACTIVATE REAL EMAIL SENDING:
   1. Sign up free at https://emailjs.com
   2. Add a Gmail service → copy SERVICE ID
   3. Create a template with: {{from_name}} {{from_email}} {{phone}} {{service_type}} {{message}}
      Set "To Email" = your business email
   4. Copy your PUBLIC KEY from Account → API Keys
   5. Paste all 3 values below
   ─────────────────────────────────────────────────────────────────────── */
var EJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';    // ← paste here
var EJS_SERVICE_ID  = 'YOUR_SERVICE_ID';    // ← paste here
var EJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';   // ← paste here
var TO_EMAIL        = 'info@tomandjerrybuilders.com';

// Init EmailJS (v4 syntax)
if (typeof emailjs !== 'undefined' && EJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
  emailjs.init({ publicKey: EJS_PUBLIC_KEY });
}

(function () {
  var form = document.getElementById('contact-form');
  var fMsg = document.getElementById('form-msg');
  var fBtn = document.getElementById('submit-btn');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fn = (form.querySelector('[name="first_name"]') .value || '').trim();
    var ln = (form.querySelector('[name="last_name"]')  .value || '').trim();
    var em = (form.querySelector('[name="email"]')      .value || '').trim();
    var ph = (form.querySelector('[name="phone"]')      .value || '').trim();
    var sv = (form.querySelector('[name="service"]')    .value || 'Not specified');
    var ms = (form.querySelector('[name="message"]')    .value || '').trim() || '(No message)';

    fMsg.className = 'form-msg'; fMsg.textContent = '';

    // Validation
    if (!fn || !ln)  return showMsg('err', '⚠ Please enter your full name.');
    if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return showMsg('err', '⚠ Please enter a valid email address.');
    if (!ph)         return showMsg('err', '⚠ Please enter your phone number.');

    fBtn.disabled = true;
    fBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

    var params = {
      from_name:    fn + ' ' + ln,
      from_email:   em,
      phone:        ph,
      service_type: sv,
      message:      ms,
      reply_to:     em,
      to_email:     TO_EMAIL
    };

    // DEMO mode (no keys set yet)
    if (EJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
      setTimeout(function () {
        resetBtn();
        form.reset();
        showMsg('ok', '✅ Demo mode — form is working! Paste your EmailJS keys into main.js to send real emails to ' + TO_EMAIL);
      }, 900);
      return;
    }

    // Live send
    emailjs.send(EJS_SERVICE_ID, EJS_TEMPLATE_ID, params)
      .then(function (res) {
        console.log('EmailJS OK', res);
        resetBtn(); form.reset();
        showMsg('ok', '✅ Message sent! We will contact you within 24 hours. You can also call 516-200-9646.');
      })
      .catch(function (err) {
        console.error('EmailJS error', err);
        resetBtn();
        var msg = '❌ ';
        switch (err.status) {
          case 400: msg += 'Template variable mismatch (400). Check your EmailJS template variables match: {{from_name}} {{from_email}} {{phone}} {{service_type}} {{message}}'; break;
          case 401: msg += 'Wrong Public Key (401). Re-copy it from emailjs.com → Account → API Keys.'; break;
          case 403: msg += 'Domain not allowed (403). Set allowed domains to * in emailjs.com → Account.'; break;
          case 404: msg += 'Service or Template ID not found (404). Double-check both values in main.js.'; break;
          case 412: msg += 'Gmail permission error (412). Delete and re-add your Gmail service in EmailJS — make sure to CHECK "Send email on your behalf" on the Google permissions screen.'; break;
          case 422: msg += 'No recipient (422). Set "To Email" to ' + TO_EMAIL + ' inside your EmailJS template.'; break;
          default:  msg += 'Error ' + (err.status || 'unknown') + '. Please call 516-200-9646 directly.';
        }
        showMsg('err', msg);
      });
  });

  function resetBtn() {
    fBtn.disabled = false;
    fBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
  }
  function showMsg(type, text) {
    fMsg.textContent = text;
    fMsg.className   = 'form-msg ' + type;
    fMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    if (type === 'ok') setTimeout(function () { fMsg.className = 'form-msg'; }, 10000);
  }
})();

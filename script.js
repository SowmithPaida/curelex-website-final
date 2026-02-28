/**
 * CURELEX HEALTHTECH — script.js
 * Vanilla JavaScript for homepage interactivity
 * Includes: navbar, scroll, reveal animations, form validation
 */

(function () {
  'use strict';

  /* ─── DOM Helpers ─────────────────────────────────────────── */
  const qs  = (sel, root = document)  => root.querySelector(sel);
  const qsa = (sel, root = document)  => Array.from(root.querySelectorAll(sel));

  /* ─── 1. Set Footer Copyright Year ───────────────────────── */
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ─── 2. Navbar: scroll state & active link ──────────────── */
  const navbar = qs('#navbar');

  const handleNavbarScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run once on load
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });


  /* ─── 3. Active Nav Link on Scroll ───────────────────────── */
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav-link');

  const updateActiveLink = () => {
    const scrollY = window.scrollY + 100; // offset for nav height

    sections.forEach(section => {
      const sectionTop    = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId     = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = qs(`.nav-link[href="#${sectionId}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();


  /* ─── 4. Mobile Menu Toggle ───────────────────────────────── */
  const hamburger  = qs('#hamburger');
  const mobileMenu = qs('#mobile-menu');

  const closeMobileMenu = () => {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.style.display = 'none';
  };

  const openMobileMenu = () => {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.style.display = 'block';
  };

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMobileMenu() : openMobileMenu();
    });

    // Close when a mobile link is clicked
    qsa('.mobile-link, .mobile-cta').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close when clicking outside the menu
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) closeMobileMenu();
    });

    // Close on resize back to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) closeMobileMenu();
    });
  }


  /* ─── 5. Smooth Scroll Navigation ────────────────────────── */
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (!anchor) return;

    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = qs(targetId);
    if (!targetEl) return;

    e.preventDefault();

    const navHeight = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-height') || '72'
    );

    const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight;

    window.scrollTo({ top, behavior: 'smooth' });
  });


  /* ─── 6. Scroll Reveal Animation ─────────────────────────── */
  const revealElements = qsa('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target); // fire once
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealElements.forEach(el => el.classList.add('visible'));
  }


  /* ─── 7. Back to Top Button ───────────────────────────────── */
  const backToTopBtn = qs('#backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ─── 8. Contact Form Validation & Submission ─────────────── */
  const contactForm  = qs('#contactForm');
  const submitBtn    = qs('#submitBtn');
  const formSuccess  = qs('#formSuccess');

  const validators = {
    /**
     * Returns an error string if invalid, empty string if valid.
     */
    name(val) {
      if (!val.trim())             return 'Please enter your full name.';
      if (val.trim().length < 2)   return 'Name must be at least 2 characters.';
      if (val.trim().length > 80)  return 'Name is too long.';
      return '';
    },

    email(val) {
      if (!val.trim()) return 'Please enter your email address.';
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRe.test(val.trim())) return 'Please enter a valid email address.';
      return '';
    },

    message(val) {
      if (!val.trim())            return 'Please enter your message.';
      if (val.trim().length < 10) return 'Message must be at least 10 characters.';
      return '';
    }
  };

  /**
   * Show or clear the error state for a form field.
   */
  const setFieldError = (input, message) => {
    const group    = input.closest('.form-group');
    const errorEl  = qs('.field-error', group);

    if (message) {
      input.classList.add('error');
      input.setAttribute('aria-invalid', 'true');
      if (errorEl) errorEl.textContent = message;
    } else {
      input.classList.remove('error');
      input.setAttribute('aria-invalid', 'false');
      if (errorEl) errorEl.textContent = '';
    }
  };

  /**
   * Validate all fields. Returns true if the form is valid.
   */
  const validateForm = () => {
    const nameInput    = qs('#fname');
    const emailInput   = qs('#femail');
    const messageInput = qs('#fmessage');

    const nameErr    = validators.name(nameInput.value);
    const emailErr   = validators.email(emailInput.value);
    const messageErr = validators.message(messageInput.value);

    setFieldError(nameInput,    nameErr);
    setFieldError(emailInput,   emailErr);
    setFieldError(messageInput, messageErr);

    // Focus the first invalid field
    if (nameErr)    { nameInput.focus();    return false; }
    if (emailErr)   { emailInput.focus();   return false; }
    if (messageErr) { messageInput.focus(); return false; }

    return true;
  };

  // Live validation: clear errors as user types
  if (contactForm) {
    ['#fname', '#femail', '#fmessage'].forEach(sel => {
      const input = qs(sel, contactForm);
      if (!input) return;

      const fieldName = input.id === 'fname'
        ? 'name'
        : input.id === 'femail'
        ? 'email'
        : 'message';

      input.addEventListener('input', () => {
        const err = validators[fieldName](input.value);
        setFieldError(input, err);
      });

      input.addEventListener('blur', () => {
        const err = validators[fieldName](input.value);
        setFieldError(input, err);
      });
    });

    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const isValid = validateForm();
      if (!isValid) return;

      // Simulate async submission
      submitBtn.classList.add('loading');

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      submitBtn.classList.remove('loading');
      contactForm.style.display = 'none';
      formSuccess.classList.add('show');
      formSuccess.removeAttribute('aria-hidden');

      // Announce to screen readers
      formSuccess.focus();
    });
  }


  /* ─── 9. Navbar Logo Fade In ─────────────────────────────── */
  // Show logo img gradually so layout paint is smooth
  const logoImgs = qsa('.nav-logo img, .footer-logo img');
  logoImgs.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity .5s ease';
    if (img.complete) {
      img.style.opacity = '1';
    } else {
      img.addEventListener('load',  () => { img.style.opacity = '1'; });
      img.addEventListener('error', () => { img.style.opacity = '1'; }); // fallback
    }
  });


  /* ─── 10. Service Card Tilt (subtle micro-interaction) ────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    qsa('.service-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect   = card.getBoundingClientRect();
        const x      = e.clientX - rect.left;
        const y      = e.clientY - rect.top;
        const midX   = rect.width  / 2;
        const midY   = rect.height / 2;
        const tiltX  = ((y - midY) / midY) * 4;   // max ±4deg
        const tiltY  = -((x - midX) / midX) * 4;

        card.style.transform = `translateY(-6px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ─── 11. Supporter Card Parallax on Hover ────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    qsa('.supporter-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect  = card.getBoundingClientRect();
        const x     = ((e.clientX - rect.left) / rect.width  - .5) * 8;
        const y     = ((e.clientY - rect.top)  / rect.height - .5) * 8;
        card.style.transform = `translateY(-4px) perspective(400px) rotateX(${-y}deg) rotateY(${x}deg)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }


  /* ─── 12. Animate Hero Stats Counter ─────────────────────── */
  const statNumbers = qsa('.stat-number');

  const animateCounter = (el) => {
  const target  = el.textContent.trim();

  // Skip animation for values like "24/7" that aren't plain numbers
  if (/[^0-9.%+]/.test(target.replace(/[kmKM]$/i, ''))) return;

  const numeric = parseFloat(target.replace(/[^0-9.]/g, ''));
  const suffix  = target.replace(/[0-9.]/g, '');
  if (isNaN(numeric)) return;

    const duration = 1200; // ms
    const start    = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased    = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * numeric) + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window && statNumbers.length) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(el => statsObserver.observe(el));
  }

  

})();
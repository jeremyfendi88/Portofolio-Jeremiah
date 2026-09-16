/**
 * ==========================================================================
 * Jeremiah Hiromi Effendi – Personal Portfolio
 * Vanilla JavaScript Engine
 * 
 * Features:
 * 1. Project Data Store & Dynamic Modal Injection
 * 2. Dark / Light Mode Switcher with localStorage
 * 3. Mobile Navigation Drawer & Hamburger Toggle
 * 4. Active Navigation State & Smooth Scroll Tracking
 * 5. Animated Skill Progress Indicators via IntersectionObserver
 * 6. Scroll Reveal Fade-in Animations
 * 7. Client-Side Validated Contact Form & Success Modal
 * 8. Download CV Interactive Trigger & Toast System
 * 9. Back to Top Smooth Navigator
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. PROJECT DATA STORE
  // --------------------------------------------------------------------------
  const projectsData = [
    {
      id: 1,
      title: 'Personal Portfolio Website',
      description: 'A responsive single-page personal portfolio designed to present personal information, skills, projects, and contact information in a professional digital format.',
      tags: ['HTML5', 'CSS3', 'JavaScript'],
      objective: 'To build a clean, modern, and accessible single-page web portfolio showcasing academic background, digital capabilities, and practical projects.',
      features: [
        'Fully responsive layout with sticky navigation and mobile slide-down drawer',
        'Dark / Light theme switcher with preference stored in localStorage',
        'Animated skill competency progress indicators triggered upon viewport entry',
        'Dynamic project detail modal dialog with keyboard ESC and backdrop dismiss',
        'Client-side validated contact inquiry form with clear user feedback'
      ]
    },
    {
      id: 2,
      title: 'Business Data Dashboard',
      description: 'A conceptual dashboard designed to organize and visualize business-related information in a clear and accessible interface.',
      tags: ['Data Visualization', 'UI Design', 'Business Analytics'],
      objective: 'To design and structure an analytical dashboard interface that consolidates core business KPIs, inventory metrics, and decision-support figures into clean visual modules.',
      features: [
        'Modular KPI metric summary cards for quick managerial review',
        'Responsive data chart layouts and structured analytical components',
        'Filterable data views and segment status highlights',
        'Clear visual hierarchy optimized for fast scanning and reporting'
      ]
    },
    {
      id: 3,
      title: 'Business Landing Page',
      description: 'A modern landing page concept designed to communicate a business value proposition and guide visitors toward a clear call to action.',
      tags: ['HTML5', 'CSS3', 'Responsive Design'],
      objective: 'To create a high-converting digital landing page tailored for modern business ventures, emphasizing clarity, value proposition, and user experience.',
      features: [
        'High-impact split-screen hero section communicating immediate value',
        'Product capability and customer trust endorsement blocks',
        'Optimized Call-to-Action pathways driving user engagement',
        'Mobile-first responsive styling ensuring consistency on all viewports'
      ]
    }
  ];

  // --------------------------------------------------------------------------
  // 2. DARK / LIGHT MODE SWITCHER
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'jeremiah_portfolio_theme';
  const themeToggles = document.querySelectorAll('.theme-toggle');

  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Default to light mode as requested by standard design system
    return 'light';
  };

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  // Initialize Theme
  applyTheme(getPreferredTheme());

  themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled');
    });
  });

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER & HAMBURGER
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  const closeMobileNav = () => {
    if (mobileNavDrawer && menuToggle) {
      mobileNavDrawer.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  };

  if (menuToggle && mobileNavDrawer) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNavDrawer.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        closeMobileNav();
      });
    });

    // Close when clicking outside header or drawer
    document.addEventListener('click', (e) => {
      if (
        mobileNavDrawer.classList.contains('is-open') &&
        !mobileNavDrawer.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        closeMobileNav();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION STATE & SCROLL TRACKING
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.nav-link');

  const highlightActiveNav = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        desktopNavLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightActiveNav, { passive: true });

  // --------------------------------------------------------------------------
  // 5. ANIMATED SKILL PROGRESS BARS (IntersectionObserver)
  // --------------------------------------------------------------------------
  const progressBars = document.querySelectorAll('.progress-bar-fill');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-progress');
            if (targetWidth) {
              bar.style.width = `${targetWidth}%`;
            }
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.2 }
    );

    progressBars.forEach((bar) => skillObserver.observe(bar));
  } else {
    // Fallback for older browsers
    progressBars.forEach((bar) => {
      const targetWidth = bar.getAttribute('data-progress');
      if (targetWidth) {
        bar.style.width = `${targetWidth}%`;
      }
    });
  }

  // --------------------------------------------------------------------------
  // 6. SCROLL REVEAL FADE-IN ANIMATIONS
  // --------------------------------------------------------------------------
  const fadeElements = document.querySelectorAll('.fade-in-element');

  if ('IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 7. PROJECT DETAIL MODAL LOGIC
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('projectModal');
  const projectModalClose = document.getElementById('projectModalClose');
  const modalCloseSecondaryBtn = document.getElementById('modalCloseSecondaryBtn');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalTechTags = document.getElementById('modalTechTags');
  const modalProjectDesc = document.getElementById('modalProjectDesc');
  const modalObjective = document.getElementById('modalObjective');
  const modalFeaturesList = document.getElementById('modalFeaturesList');
  const modalImageLabel = document.getElementById('modalImageLabel');

  const openProjectModal = (projectId) => {
    const project = projectsData.find((p) => p.id === Number(projectId));
    if (!project || !projectModal) return;

    // Populate Fields
    modalProjectTitle.textContent = project.title;
    modalImageLabel.textContent = `${project.title} — Detail View`;
    modalProjectDesc.textContent = project.description;
    modalObjective.textContent = project.objective;

    // Populate Tech Tags
    modalTechTags.innerHTML = '';
    project.tags.forEach((tag) => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'tag';
      tagSpan.textContent = tag;
      modalTechTags.appendChild(tagSpan);
    });

    // Populate Features List
    modalFeaturesList.innerHTML = '';
    project.features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      modalFeaturesList.appendChild(li);
    });

    // Open Modal
    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Set focus to close button for accessibility
    setTimeout(() => {
      projectModalClose.focus();
    }, 50);
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  // Attach click listeners to all "View Details" buttons
  const viewProjectButtons = document.querySelectorAll('.btn-view-project');
  viewProjectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = btn.getAttribute('data-project-id');
      openProjectModal(projectId);
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (modalCloseSecondaryBtn) {
    modalCloseSecondaryBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION & SUCCESS MODAL
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const scopeSelect = document.getElementById('contactScope');
  const messageInput = document.getElementById('contactMessage');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const scopeError = document.getElementById('scopeError');
  const messageError = document.getElementById('messageError');

  const successModal = document.getElementById('successModal');
  const successModalClose = document.getElementById('successModalClose');
  const successModalOkBtn = document.getElementById('successModalOkBtn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, errorEl, condition) => {
    if (!condition) {
      input.classList.add('is-invalid');
      errorEl.classList.add('is-visible');
      return false;
    } else {
      input.classList.remove('is-invalid');
      errorEl.classList.remove('is-visible');
      return true;
    }
  };

  // Real-time validation clears error state when user types
  if (nameInput) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim() !== '') {
        nameInput.classList.remove('is-invalid');
        nameError.classList.remove('is-visible');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('is-invalid');
        emailError.classList.remove('is-visible');
      }
    });
  }

  if (scopeSelect) {
    scopeSelect.addEventListener('change', () => {
      if (scopeSelect.value !== '') {
        scopeSelect.classList.remove('is-invalid');
        scopeError.classList.remove('is-visible');
      }
    });
  }

  if (messageInput) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim() !== '') {
        messageInput.classList.remove('is-invalid');
        messageError.classList.remove('is-visible');
      }
    });
  }

  const openSuccessModal = () => {
    if (successModal) {
      successModal.classList.add('is-active');
      successModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => successModalOkBtn.focus(), 50);
    }
  };

  const closeSuccessModal = () => {
    if (successModal) {
      successModal.classList.remove('is-active');
      successModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(
        nameInput,
        nameError,
        nameInput.value.trim().length > 0
      );

      const isEmailValid = validateField(
        emailInput,
        emailError,
        emailRegex.test(emailInput.value.trim())
      );

      const isScopeValid = validateField(
        scopeSelect,
        scopeError,
        scopeSelect.value !== ''
      );

      const isMessageValid = validateField(
        messageInput,
        messageError,
        messageInput.value.trim().length > 0
      );

      if (isNameValid && isEmailValid && isScopeValid && isMessageValid) {
        // Form is valid: show success modal and reset form
        openSuccessModal();
        contactForm.reset();
      } else {
        // Focus first invalid element
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isScopeValid) scopeSelect.focus();
        else if (!isMessageValid) messageInput.focus();
      }
    });
  }

  if (successModalClose) {
    successModalClose.addEventListener('click', closeSuccessModal);
  }

  if (successModalOkBtn) {
    successModalOkBtn.addEventListener('click', closeSuccessModal);
  }

  if (successModal) {
    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  // Global ESC Key Listener for all open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (projectModal && projectModal.classList.contains('is-active')) {
        closeProjectModal();
      }
      if (successModal && successModal.classList.contains('is-active')) {
        closeSuccessModal();
      }
    }
  });

  // --------------------------------------------------------------------------
  // 9. DOWNLOAD CV INTERACTION & TOAST SYSTEM
  // --------------------------------------------------------------------------
  const heroDownloadCvBtn = document.getElementById('heroDownloadCvBtn');
  const toastContainer = document.getElementById('toastContainer');

  function showToast(message, duration = 3500) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg class="toast-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  const triggerCvDownload = () => {
    // Generate clean, comprehensive plain-text CV
    const cvContent = `================================================================================
JEREMIAH HIROMI EFFENDI
Business & Digital Technology | Politeknik Internasional Bali
================================================================================

CONTACT INFORMATION
--------------------------------------------------------------------------------
Full Name: Jeremiah Hiromi Effendi
Student ID (NIM): 131620260003
University: Politeknik Internasional Bali (Semester 1)
Email: effendijeremiah88@gmail.com
Field / Industry: Business & Digital Technology

CORE VALUE PROPOSITION
--------------------------------------------------------------------------------
"A business student who combines business knowledge, digital skills,
creativity, and basic web development to create practical and user-friendly
digital solutions."

PROFILE SUMMARY
--------------------------------------------------------------------------------
I am Jeremiah Hiromi Effendi, a business student interested in the intersection
between business and digital technology. I enjoy learning how technology can be
used to solve practical problems, improve user experiences, and support business
objectives. Through my academic activities and projects, I continue developing
skills in business analysis, digital technology, web development, presentation,
and creative problem-solving.

CORE COMPETENCIES & PROFICIENCY
--------------------------------------------------------------------------------
• Business & Management               [85%]
• Communication & Presentation        [85%]
• HTML & CSS                          [80%]
• JavaScript                          [75%]
• Data Analysis                       [70%]

SERVICES & CAPABILITIES
--------------------------------------------------------------------------------
1. Business Analysis
   Understanding business problems, organizing information, and developing
   practical insights to support decision-making.

2. Web Development
   Creating responsive and user-friendly front-end websites using HTML, CSS,
   and JavaScript.

3. Digital Solutions
   Combining business concepts and digital technology to create practical
   and engaging solutions.

FEATURED PROJECTS
--------------------------------------------------------------------------------
1. Personal Portfolio Website
   Technologies: HTML5, CSS3, JavaScript
   Description: Responsive single-page web portfolio designed to present
   academic credentials, skills, and projects with dark/light themes.

2. Business Data Dashboard
   Technologies: Data Visualization, UI Design, Business Analytics
   Description: Conceptual dashboard designed to organize and visualize
   business-related information and KPIs in a clear, accessible interface.

3. Business Landing Page
   Technologies: HTML5, CSS3, Responsive Design
   Description: Modern conversion-focused landing page communicating value
   propositions and driving visitor engagement.

ACADEMIC REFERENCES & RECOMMENDATIONS
--------------------------------------------------------------------------------
• Lecturer / Academic Mentor:
  "Jeremiah demonstrates a strong willingness to learn and consistently
  approaches projects with curiosity and responsibility."
• Project Teammate:
  "Collaborative, organized, and always keen on bridging business requirements
  with clean digital implementation."
• Classmate:
  "Brings great energy and problem-solving creativity to group discussions
  and technology coursework."

================================================================================
Generated from Jeremiah Hiromi Effendi's Official Portfolio
© 2026 Jeremiah Hiromi Effendi. All Rights Reserved.
================================================================================`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Jeremiah_Hiromi_Effendi_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('📄 Downloaded Jeremiah Hiromi Effendi CV');
  };

  if (heroDownloadCvBtn) {
    heroDownloadCvBtn.addEventListener('click', triggerCvDownload);
  }

  // --------------------------------------------------------------------------
  // 10. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn');

  if (backToTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 300) {
          backToTopBtn.classList.add('is-visible');
        } else {
          backToTopBtn.classList.remove('is-visible');
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

import { submitContactInquiry } from './services/contactService';
import { findProjectById, getProjects, ProjectItem } from './services/projectService';
import { isSupabaseConfigured } from './lib/supabase';

// Mark document as JS-ready for progressive enhancement
document.documentElement.classList.add('js-ready');

document.addEventListener('DOMContentLoaded', async () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. DYNAMIC PROJECTS INITIALIZATION
  // --------------------------------------------------------------------------
  await getProjects();

  // --------------------------------------------------------------------------
  // 2. NAVY BLUE & LIGHT THEME SWITCHER
  // --------------------------------------------------------------------------
  const THEME_STORAGE_KEY = 'jeremiah_portfolio_theme_v2';
  const themeToggles = document.querySelectorAll<HTMLButtonElement>('.theme-toggle');

  const getPreferredTheme = (): string => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'light') {
      return 'light';
    }
    return 'navy';
  };

  const applyTheme = (theme: string): void => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  };

  applyTheme(getPreferredTheme());

  themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const newTheme = isLight ? 'navy' : 'light';
      applyTheme(newTheme);
      showToast(newTheme === 'navy' ? '🌊 Tema Biru Navy aktif' : '☀️ Mode Terang diaktifkan');
    });
  });

  // --------------------------------------------------------------------------
  // 2B. AUTHENTIC PROFILE PHOTO UPLOADER & LOCAL STORAGE
  // --------------------------------------------------------------------------
  const PHOTO_STORAGE_KEY = 'jeremiah_original_profile_photo';
  const profilePhotoImg = document.getElementById('profilePhotoImg') as HTMLImageElement | null;
  const profilePhotoContainer = document.getElementById('profilePhotoContainer');
  const uploadPhotoBtn = document.getElementById('uploadPhotoBtn') as HTMLButtonElement | null;
  const profilePhotoInput = document.getElementById('profilePhotoInput') as HTMLInputElement | null;

  // Load saved authentic photo if present
  const savedPhoto = localStorage.getItem(PHOTO_STORAGE_KEY);
  if (savedPhoto && profilePhotoImg) {
    profilePhotoImg.src = savedPhoto;
  }

  const handlePhotoFile = (file: File): void => {
    if (!file.type.startsWith('image/')) {
      showToast('⚠️ Mohon pilih file gambar (.jpg, .png, .jpeg)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl && profilePhotoImg) {
        profilePhotoImg.src = dataUrl;
        try {
          localStorage.setItem(PHOTO_STORAGE_KEY, dataUrl);
        } catch (err) {
          console.warn('Could not save to localStorage', err);
        }
        showToast('✅ Foto asli berhasil diterapkan tanpa editan!');
      }
    };
    reader.readAsDataURL(file);
  };

  if (uploadPhotoBtn && profilePhotoInput) {
    uploadPhotoBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profilePhotoInput.click();
    });
  }

  if (profilePhotoContainer && profilePhotoInput) {
    profilePhotoContainer.addEventListener('click', () => {
      profilePhotoInput.click();
    });

    profilePhotoInput.addEventListener('change', () => {
      const file = profilePhotoInput.files?.[0];
      if (file) {
        handlePhotoFile(file);
      }
    });

    // Drag and drop support
    profilePhotoContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      profilePhotoContainer.classList.add('is-dragover');
    });

    profilePhotoContainer.addEventListener('dragleave', () => {
      profilePhotoContainer.classList.remove('is-dragover');
    });

    profilePhotoContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      profilePhotoContainer.classList.remove('is-dragover');
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        handlePhotoFile(file);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. MOBILE NAVIGATION DRAWER & HAMBURGER
  // --------------------------------------------------------------------------
  const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement | null;
  const mobileNavDrawer = document.getElementById('mobileNavDrawer') as HTMLElement | null;
  const mobileNavLinks = document.querySelectorAll<HTMLAnchorElement>('.mobile-nav-link');

  const closeMobileNav = (): void => {
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

    document.addEventListener('click', (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        mobileNavDrawer.classList.contains('is-open') &&
        !mobileNavDrawer.contains(target) &&
        !menuToggle.contains(target)
      ) {
        closeMobileNav();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 4. ACTIVE NAVIGATION STATE & SCROLL TRACKING
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const desktopNavLinks = document.querySelectorAll<HTMLAnchorElement>('.nav-link');

  const highlightActiveNav = (): void => {
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
  const progressBars = document.querySelectorAll<HTMLElement>('.progress-bar-fill');

  if ('IntersectionObserver' in window) {
    const skillObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target as HTMLElement;
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
  const fadeElements = document.querySelectorAll<HTMLElement>('.fade-in-element');

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
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    fadeElements.forEach((el) => fadeObserver.observe(el));
  } else {
    fadeElements.forEach((el) => el.classList.add('is-visible'));
  }

  // --------------------------------------------------------------------------
  // 7. PROJECT DETAIL MODAL LOGIC
  // --------------------------------------------------------------------------
  const projectModal = document.getElementById('projectModal') as HTMLElement | null;
  const projectModalClose = document.getElementById('projectModalClose') as HTMLButtonElement | null;
  const modalCloseSecondaryBtn = document.getElementById('modalCloseSecondaryBtn') as HTMLButtonElement | null;
  const modalProjectTitle = document.getElementById('modalProjectTitle') as HTMLElement | null;
  const modalTechTags = document.getElementById('modalTechTags') as HTMLElement | null;
  const modalProjectDesc = document.getElementById('modalProjectDesc') as HTMLElement | null;
  const modalObjective = document.getElementById('modalObjective') as HTMLElement | null;
  const modalFeaturesList = document.getElementById('modalFeaturesList') as HTMLElement | null;
  const modalImageLabel = document.getElementById('modalImageLabel') as HTMLElement | null;

  const openProjectModal = (projectId: number): void => {
    const project = findProjectById(projectId);
    if (!project || !projectModal) return;

    if (modalProjectTitle) modalProjectTitle.textContent = project.title;
    if (modalImageLabel) modalImageLabel.textContent = `${project.title} — Detail View`;
    if (modalProjectDesc) modalProjectDesc.textContent = project.description;
    if (modalObjective) modalObjective.textContent = project.objective;

    if (modalTechTags) {
      modalTechTags.innerHTML = '';
      project.tags.forEach((tag) => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        modalTechTags.appendChild(tagSpan);
      });
    }

    if (modalFeaturesList) {
      modalFeaturesList.innerHTML = '';
      project.features.forEach((feature) => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalFeaturesList.appendChild(li);
      });
    }

    projectModal.classList.add('is-active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    setTimeout(() => {
      projectModalClose?.focus();
    }, 50);
  };

  const closeProjectModal = (): void => {
    if (!projectModal) return;
    projectModal.classList.remove('is-active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const viewProjectButtons = document.querySelectorAll<HTMLButtonElement>('.btn-view-project');
  viewProjectButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const projectId = Number(btn.getAttribute('data-project-id'));
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });

  if (projectModalClose) {
    projectModalClose.addEventListener('click', closeProjectModal);
  }

  if (modalCloseSecondaryBtn) {
    modalCloseSecondaryBtn.addEventListener('click', closeProjectModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e: MouseEvent) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // --------------------------------------------------------------------------
  // 8. CONTACT FORM VALIDATION & SUPABASE SUBMISSION
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm') as HTMLFormElement | null;
  const nameInput = document.getElementById('contactName') as HTMLInputElement | null;
  const emailInput = document.getElementById('contactEmail') as HTMLInputElement | null;
  const scopeSelect = document.getElementById('contactScope') as HTMLSelectElement | null;
  const messageInput = document.getElementById('contactMessage') as HTMLTextAreaElement | null;
  const submitBtn = contactForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

  const nameError = document.getElementById('nameError') as HTMLElement | null;
  const emailError = document.getElementById('emailError') as HTMLElement | null;
  const scopeError = document.getElementById('scopeError') as HTMLElement | null;
  const messageError = document.getElementById('messageError') as HTMLElement | null;

  const successModal = document.getElementById('successModal') as HTMLElement | null;
  const successModalClose = document.getElementById('successModalClose') as HTMLButtonElement | null;
  const successModalOkBtn = document.getElementById('successModalOkBtn') as HTMLButtonElement | null;
  const successTitle = document.getElementById('successTitle') as HTMLElement | null;
  const successMessage = document.querySelector('.success-message') as HTMLElement | null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input: HTMLElement | null, errorEl: HTMLElement | null, condition: boolean): boolean => {
    if (!input || !errorEl) return false;
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

  if (nameInput && nameError) {
    nameInput.addEventListener('input', () => {
      if (nameInput.value.trim() !== '') {
        nameInput.classList.remove('is-invalid');
        nameError.classList.remove('is-visible');
      }
    });
  }

  if (emailInput && emailError) {
    emailInput.addEventListener('input', () => {
      if (emailRegex.test(emailInput.value.trim())) {
        emailInput.classList.remove('is-invalid');
        emailError.classList.remove('is-visible');
      }
    });
  }

  if (scopeSelect && scopeError) {
    scopeSelect.addEventListener('change', () => {
      if (scopeSelect.value !== '') {
        scopeSelect.classList.remove('is-invalid');
        scopeError.classList.remove('is-visible');
      }
    });
  }

  if (messageInput && messageError) {
    messageInput.addEventListener('input', () => {
      if (messageInput.value.trim() !== '') {
        messageInput.classList.remove('is-invalid');
        messageError.classList.remove('is-visible');
      }
    });
  }

  const openSuccessModal = (destination: 'supabase' | 'local'): void => {
    if (successModal) {
      if (successTitle) {
        successTitle.textContent = destination === 'supabase' ? 'Message Sent to Database!' : 'Message Received!';
      }
      if (successMessage) {
        successMessage.textContent = destination === 'supabase'
          ? 'Thank you for contacting me. Your message has been saved to the Supabase database. I will get back to you soon.'
          : 'Thank you for contacting me. Your message has been received and stored. I will get back to you soon.';
      }
      successModal.classList.add('is-active');
      successModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      setTimeout(() => successModalOkBtn?.focus(), 50);
    }
  };

  const closeSuccessModal = (): void => {
    if (successModal) {
      successModal.classList.remove('is-active');
      successModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (contactForm) {
    contactForm.addEventListener('submit', async (e: SubmitEvent) => {
      e.preventDefault();

      if (!nameInput || !emailInput || !scopeSelect || !messageInput) return;

      const isNameValid = validateField(nameInput, nameError, nameInput.value.trim().length > 0);
      const isEmailValid = validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()));
      const isScopeValid = validateField(scopeSelect, scopeError, scopeSelect.value !== '');
      const isMessageValid = validateField(messageInput, messageError, messageInput.value.trim().length > 0);

      if (isNameValid && isEmailValid && isScopeValid && isMessageValid) {
        const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = `<span>Sending...</span>`;
        }

        try {
          const result = await submitContactInquiry({
            name: nameInput.value,
            email: emailInput.value,
            scope: scopeSelect.value,
            message: messageInput.value,
          });

          openSuccessModal(result.destination);
          contactForm.reset();
        } catch (err) {
          console.error('Submission error:', err);
          openSuccessModal('local');
          contactForm.reset();
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }
      } else {
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
    successModal.addEventListener('click', (e: MouseEvent) => {
      if (e.target === successModal) {
        closeSuccessModal();
      }
    });
  }

  // Global ESC Key Listener
  document.addEventListener('keydown', (e: KeyboardEvent) => {
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
  const heroDownloadCvBtn = document.getElementById('heroDownloadCvBtn') as HTMLButtonElement | null;
  const toastContainer = document.getElementById('toastContainer') as HTMLElement | null;

  function showToast(message: string, duration: number = 3500): void {
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

  const triggerCvDownload = (): void => {
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
  // 9B. ARSENAL (SKILLS) CAROUSEL & FILTER TABS (From Reference Layout)
  // --------------------------------------------------------------------------
  const arsenalTabs = document.querySelectorAll<HTMLButtonElement>('.arsenal-tab-pill');
  const arsenalCards = document.querySelectorAll<HTMLElement>('.arsenal-card');
  const arsenalViewport = document.getElementById('arsenalViewport') as HTMLElement | null;
  const arsenalPrevBtn = document.getElementById('arsenalPrevBtn') as HTMLButtonElement | null;
  const arsenalNextBtn = document.getElementById('arsenalNextBtn') as HTMLButtonElement | null;

  if (arsenalTabs.length > 0 && arsenalCards.length > 0) {
    arsenalTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filterValue = tab.getAttribute('data-filter') || 'all';

        // Update active tab styles and accessibility
        arsenalTabs.forEach((t) => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');

        // Filter cards
        arsenalCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          if (filterValue === 'all' || cardCategory === filterValue) {
            card.classList.remove('is-hidden');
            // Trigger progress fill if animated
            const bar = card.querySelector<HTMLElement>('.arsenal-progress-bar');
            if (bar) {
              const targetWidth = bar.getAttribute('data-progress');
              if (targetWidth) {
                bar.style.width = `${targetWidth}%`;
              }
            }
          } else {
            card.classList.add('is-hidden');
          }
        });

        // Reset scroll position to start
        if (arsenalViewport) {
          arsenalViewport.scrollTo({ left: 0, behavior: 'smooth' });
        }
      });
    });
  }

  // Prev / Next scroll buttons
  if (arsenalViewport) {
    const scrollStep = 250;

    if (arsenalPrevBtn) {
      arsenalPrevBtn.addEventListener('click', () => {
        arsenalViewport.scrollBy({ left: -scrollStep, behavior: 'smooth' });
      });
    }

    if (arsenalNextBtn) {
      arsenalNextBtn.addEventListener('click', () => {
        arsenalViewport.scrollBy({ left: scrollStep, behavior: 'smooth' });
      });
    }

    // Drag-to-scroll functionality for mouse users
    let isDown = false;
    let startX = 0;
    let scrollLeftPos = 0;

    arsenalViewport.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true;
      arsenalViewport.style.cursor = 'grabbing';
      startX = e.pageX - arsenalViewport.offsetLeft;
      scrollLeftPos = arsenalViewport.scrollLeft;
    });

    arsenalViewport.addEventListener('mouseleave', () => {
      isDown = false;
      arsenalViewport.style.cursor = '';
    });

    arsenalViewport.addEventListener('mouseup', () => {
      isDown = false;
      arsenalViewport.style.cursor = '';
    });

    arsenalViewport.addEventListener('mousemove', (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - arsenalViewport.offsetLeft;
      const walk = (x - startX) * 1.5;
      arsenalViewport.scrollLeft = scrollLeftPos - walk;
    });
  }

  // --------------------------------------------------------------------------
  // 10. BACK TO TOP BUTTON
  // --------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('backToTopBtn') as HTMLButtonElement | null;

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
        behavior: 'smooth',
      });
    });
  }
});

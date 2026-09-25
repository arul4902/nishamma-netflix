/* ==========================================================================
   INTERACTIVE LOGIC — INTRO, PROFILES, CHAT, NNN, LOVE METER, FINALE & LIGHTBOX
   ========================================================================== */

class InteractiveSystem {
  constructor(audioEngine) {
    this.audio = audioEngine;
    this.currentProfile = NISHAMMA_DATA.profiles[0];
    this.lightboxIndex = 0;
    this.easterEggClicks = 0;
    this.isChatAnimated = false;
    this.isFinaleAnimated = false;

    this.init();
  }

  init() {
    this.setupIntroSequence();
    this.setupProfiles();
    this.setupChatSimulator();
    this.setupNNNNews();
    this.setupLoveMeter();
    this.setupEasterEgg();
    this.setupLightbox();
    this.setupModals();
    this.setupConfetti();
  }

  /* ========================================================================
     1. CINEMATIC INTRO SEQUENCE
     ======================================================================== */
  setupIntroSequence() {
    const introEl = document.getElementById('cinematic-intro');
    const laserLine = document.getElementById('intro-laser-line');
    const monogram = document.getElementById('intro-monogram');
    const badgeTag = document.getElementById('intro-badge-tag');
    const titleReveal = document.getElementById('intro-title-reveal');
    const skipBtn = document.getElementById('skip-intro-btn');

    if (!introEl) return;

    const startAnimation = () => {
      // Step 1: Laser line & Sound (0.4s)
      setTimeout(() => {
        if (laserLine) {
          laserLine.style.opacity = '1';
          laserLine.style.transform = 'scaleX(1)';
        }
        if (this.audio) {
          this.audio.playCinematicIntroChime();
        }
      }, 400);

      // Step 2: Glowing Monogram 'N' (1.4s)
      setTimeout(() => {
        if (monogram) {
          monogram.style.opacity = '1';
          monogram.style.transform = 'scale(1) translateY(0)';
          monogram.style.filter = 'blur(0)';
        }
      }, 1400);

      // Step 3: "A FAMILY ORIGINAL" (2.6s)
      setTimeout(() => {
        if (badgeTag) {
          badgeTag.style.opacity = '1';
          badgeTag.style.transform = 'translateY(0)';
        }
      }, 2600);

      // Step 4: "NISHAMMA" (3.8s)
      setTimeout(() => {
        if (titleReveal) {
          titleReveal.style.opacity = '1';
          titleReveal.style.transform = 'translateY(0)';
        }
      }, 3800);

      // Step 5: Transition to Profile Screen (6.2s)
      setTimeout(() => {
        this.finishIntro();
      }, 6200);
    };

    // User interaction or auto-trigger
    const userInteract = () => {
      document.removeEventListener('click', userInteract);
      document.removeEventListener('keydown', userInteract);
      if (this.audio) {
        this.audio.getAudioContext();
        this.audio.startSiteAudio();
      }
    };
    document.addEventListener('click', userInteract, { once: true });
    document.addEventListener('keydown', userInteract, { once: true });

    if (skipBtn) {
      skipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.finishIntro();
      });
    }

    // Try auto-play immediately if browser allows
    if (this.audio) {
      this.audio.startSiteAudio();
    }

    startAnimation();
  }

  finishIntro() {
    const introEl = document.getElementById('cinematic-intro');
    if (introEl && !introEl.classList.contains('is-hidden')) {
      introEl.classList.add('is-hidden');
    }
    if (this.audio) {
      this.audio.startSiteAudio();
    }
  }

  /* ========================================================================
     2. WHO'S WATCHING? PROFILE SELECTION
     ======================================================================== */
  setupProfiles() {
    const profileOverlay = document.getElementById('profile-selection-screen');
    const profileGrid = document.getElementById('profile-grid');
    const headerProfilePill = document.getElementById('header-profile-pill');

    if (!profileGrid) return;

    // Render Profiles from Data
    profileGrid.innerHTML = NISHAMMA_DATA.profiles.map(p => `
      <div class="profile-card ${p.isStar ? 'is-star' : ''}" data-id="${p.id}" tabindex="0" role="button" aria-label="${p.name}">
        <div class="profile-avatar-box">
          <img src="${p.avatar}" alt="${p.name}" class="profile-img" loading="lazy">
        </div>
        <div class="profile-name">${p.name}</div>
        <div class="profile-tagline">${p.tagline}</div>
      </div>
    `).join('');

    const cards = profileGrid.querySelectorAll('.profile-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const profile = NISHAMMA_DATA.profiles.find(p => p.id === id);
        this.selectProfile(profile);
      });
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          card.click();
        }
      });
    });

    if (headerProfilePill) {
      headerProfilePill.addEventListener('click', () => {
        if (profileOverlay) {
          profileOverlay.classList.remove('is-hidden');
        }
      });
    }
  }

  selectProfile(profile) {
    if (this.audio) {
      this.audio.startSiteAudio();
    }
    this.currentProfile = profile;
    const profileOverlay = document.getElementById('profile-selection-screen');
    const avatarImg = document.getElementById('header-avatar-img');
    const avatarName = document.getElementById('header-avatar-name');

    if (avatarImg) avatarImg.src = profile.avatar;
    if (avatarName) avatarName.textContent = profile.name;

    if (profileOverlay) {
      profileOverlay.classList.add('is-hidden');
    }

    if (profile.id === 'nishamma') {
      this.showToast('❤️ Welcome, Nishamma! Your Original Series is now streaming.');
    } else {
      this.showToast(`✨ Watching as ${profile.name} (${profile.role})`);
    }
  }

  /* ========================================================================
     3. EPISODE 03: THE OVERCARING MOM (CHAT SIMULATOR)
     ======================================================================== */
  setupChatSimulator() {
    const chatBody = document.getElementById('chat-simulator-body');
    const replayBtn = document.getElementById('replay-chat-btn');
    if (!chatBody) return;

    this.runChatSequence();

    if (replayBtn) {
      replayBtn.addEventListener('click', () => {
        this.runChatSequence();
      });
    }
  }

  runChatSequence() {
    const chatBody = document.getElementById('chat-simulator-body');
    if (!chatBody) return;

    chatBody.innerHTML = '';

    const messages = [
      { sender: 'mom', text: 'Did you eat lunch? Don\'t skip meals.' },
      { sender: 'me', text: 'Yes Amma, I just ate! Don\'t worry.' },
      { sender: 'mom', text: 'What did you eat? Was it homemade?' },
      { sender: 'mom', text: 'Are you okay? Why didn\'t you call in the morning?' },
      { sender: 'me', text: 'I had a meeting Amma, will call you soon.' },
      { sender: 'mom', text: 'Call me when you reach home without fail. 😂❤️' }
    ];

    let delay = 300;

    messages.forEach((msg, idx) => {
      // Add typing indicator before mom messages
      if (msg.sender === 'mom') {
        setTimeout(() => {
          this.showTypingIndicator(chatBody);
        }, delay);
        delay += 900;
      }

      setTimeout(() => {
        this.removeTypingIndicator(chatBody);
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${msg.sender === 'mom' ? 'incoming' : 'outgoing'}`;
        const timeStr = new Date(Date.now() - (messages.length - idx) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        bubble.innerHTML = `
          <div>${msg.text}</div>
          <div class="chat-timestamp">${timeStr}</div>
        `;
        chatBody.appendChild(bubble);
        chatBody.scrollTop = chatBody.scrollHeight;
      }, delay);

      delay += 800;
    });
  }

  showTypingIndicator(container) {
    this.removeTypingIndicator(container);
    const typing = document.createElement('div');
    typing.id = 'active-typing-indicator';
    typing.className = 'typing-box';
    typing.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    container.appendChild(typing);
    container.scrollTop = container.scrollHeight;
  }

  removeTypingIndicator(container) {
    const active = container.querySelector('#active-typing-indicator');
    if (active) active.remove();
  }

  /* ========================================================================
     4. EPISODE 04: BREAKING NEWS NETWORK (NNN)
     ======================================================================== */
  setupNNNNews() {
    const checkSourceBtn = document.getElementById('check-source-btn');
    const nnnModal = document.getElementById('nnn-source-modal');

    if (checkSourceBtn && nnnModal) {
      checkSourceBtn.addEventListener('click', () => {
        nnnModal.classList.add('is-open');
        this.triggerNotificationFrenzy();
      });
    }
  }

  triggerNotificationFrenzy() {
    const notificationTexts = [
      'WhatsApp: Amma forwarded a video (Forwarded many times)',
      'WhatsApp: "Drink hot water at 4 AM to cure all problems!"',
      'WhatsApp: "NASA says tomorrow moon is red!"',
      'Aby: "Amma that is from Facebook 2012 😂"',
      'Amma: "Still very good advice, you should try!"'
    ];

    notificationTexts.forEach((text, i) => {
      setTimeout(() => {
        this.showToast(text, 4000);
      }, i * 700);
    });
  }

  /* ========================================================================
     5. UNIQUE FEATURE: FAMILY LOVE METER
     ======================================================================== */
  setupLoveMeter() {
    const holdBtn = document.getElementById('love-meter-btn');
    const fillBar = document.getElementById('love-meter-fill');
    const percentLabel = document.getElementById('love-meter-percent');
    const statusLabel = document.getElementById('love-meter-status');

    if (!holdBtn || !fillBar || !percentLabel) return;

    let holdInterval = null;
    let currentPercent = 10;

    const stages = [
      { val: 25, label: "Reminding everyone to drink water..." },
      { val: 50, label: "Packing double snacks for everyone..." },
      { val: 75, label: "Calling 4 times before the flight lands..." },
      { val: 100, label: "Making sure all 8 people have eaten..." },
      { val: 200, label: "Watching reels and forwarding to 6 groups..." },
      { val: 500, label: "Grandma superpowers fully unlocked..." },
      { val: 999, label: "🚨 ERROR: TOO MUCH LOVE ❤️" }
    ];

    const startCharging = () => {
      if (holdInterval) clearInterval(holdInterval);
      holdInterval = setInterval(() => {
        if (currentPercent < 999) {
          if (currentPercent < 100) currentPercent += 3;
          else if (currentPercent < 300) currentPercent += 12;
          else currentPercent += 35;

          if (currentPercent > 999) currentPercent = 999;

          fillBar.style.width = `${Math.min(100, (currentPercent / 999) * 100)}%`;
          percentLabel.textContent = `${currentPercent}%`;

          const curStage = [...stages].reverse().find(s => currentPercent >= s.val);
          if (curStage && statusLabel) {
            statusLabel.textContent = curStage.label;
          }

          if (currentPercent >= 999) {
            clearInterval(holdInterval);
            statusLabel.innerHTML = `<strong>🚨 ERROR: TOO MUCH LOVE ❤️</strong><br><span style="color:#FFF;">Please eat something and call her back immediately!</span>`;
            holdBtn.textContent = 'HEART OVERFLOWING ❤️';
            this.launchConfetti();
          }
        }
      }, 50);
    };

    const stopCharging = () => {
      if (currentPercent < 999) {
        clearInterval(holdInterval);
      }
    };

    holdBtn.addEventListener('mousedown', startCharging);
    window.addEventListener('mouseup', stopCharging);
    holdBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startCharging(); });
    window.addEventListener('touchend', stopCharging);
  }

  /* ========================================================================
     6. SECRET EASTER EGG (3 CLICKS ON REEL ICON)
     ======================================================================== */
  setupEasterEgg() {
    const eggBtn = document.getElementById('secret-easter-egg-btn');
    const popup = document.getElementById('easter-egg-popup');
    const closeBtn = document.getElementById('easter-egg-close-btn');

    if (!eggBtn) return;

    eggBtn.addEventListener('click', () => {
      this.easterEggClicks++;
      if (this.easterEggClicks === 1) {
        this.showToast('🗞️ Breaking news hint: Click 2 more times...');
      } else if (this.easterEggClicks === 2) {
        this.showToast('🗞️ Almost there! 1 more click...');
      } else if (this.easterEggClicks >= 3) {
        this.easterEggClicks = 0;
        if (popup) popup.classList.add('is-active');
        this.triggerNotificationFrenzy();
      }
    });

    if (closeBtn && popup) {
      closeBtn.addEventListener('click', () => {
        popup.classList.remove('is-active');
      });
    }
  }

  /* ========================================================================
     7. FULLSCREEN LIGHTBOX
     ======================================================================== */
  setupLightbox() {
    const modal = document.getElementById('lightbox-modal');
    const imgEl = document.getElementById('lightbox-img');
    const captionEl = document.getElementById('lightbox-caption');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    const closeBtn = document.getElementById('lightbox-close');

    if (!modal) return;

    this.lightboxImages = NISHAMMA_DATA.memoryMosaic;

    const openLightbox = (index) => {
      this.lightboxIndex = index;
      const item = this.lightboxImages[this.lightboxIndex];
      if (item && imgEl) {
        imgEl.src = item.image;
        if (captionEl) {
          captionEl.textContent = `${item.tag} — ${item.title} (${this.lightboxIndex + 1}/${this.lightboxImages.length})`;
        }
        modal.classList.add('is-open');
      }
    };

    window.openGalleryLightbox = (idx) => openLightbox(idx);

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.lightboxIndex = (this.lightboxIndex - 1 + this.lightboxImages.length) % this.lightboxImages.length;
        openLightbox(this.lightboxIndex);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.lightboxIndex = (this.lightboxIndex + 1) % this.lightboxImages.length;
        openLightbox(this.lightboxIndex);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('is-open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });

    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') modal.classList.remove('is-open');
      if (e.key === 'ArrowLeft' && prevBtn) prevBtn.click();
      if (e.key === 'ArrowRight' && nextBtn) nextBtn.click();
    });
  }

  /* ========================================================================
     8. MODALS & INFO DIALOGS
     ======================================================================== */
  setupModals() {
    const moreInfoBtn = document.getElementById('hero-more-info-btn');
    const moreInfoModal = document.getElementById('more-info-modal');
    const closeBtns = document.querySelectorAll('.modal-close-btn');

    if (moreInfoBtn && moreInfoModal) {
      moreInfoBtn.addEventListener('click', () => {
        moreInfoModal.classList.add('is-open');
      });
    }

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('is-open');
      });
    });

    // Close on overlay click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('is-open');
      });
    });
  }

  /* ========================================================================
     9. BIRTHDAY FINALE TRIGGER
     ======================================================================== */
  triggerFinaleSequence() {
    if (this.isFinaleAnimated) return;
    this.isFinaleAnimated = true;

    const sentenceEl = document.getElementById('finale-sentence-display');
    const grandTitle = document.getElementById('finale-grand-title');
    const letterBox = document.getElementById('finale-letter-box');

    const sentences = NISHAMMA_DATA.finaleSentences;
    let delay = 400;

    sentences.forEach((sentence, idx) => {
      setTimeout(() => {
        if (sentenceEl) {
          sentenceEl.style.opacity = '0';
          sentenceEl.style.transform = 'translateY(15px)';
          setTimeout(() => {
            sentenceEl.textContent = `"${sentence}"`;
            sentenceEl.style.transition = 'all 0.8s var(--ease-cinematic)';
            sentenceEl.style.opacity = '1';
            sentenceEl.style.transform = 'translateY(0)';
          }, 300);
        }
      }, delay);
      delay += 2400;
    });

    // Final grand reveal
    setTimeout(() => {
      if (sentenceEl) sentenceEl.style.display = 'none';
      if (grandTitle) {
        grandTitle.style.display = 'block';
        grandTitle.style.animation = 'hero-slow-zoom 1.2s ease';
      }
      if (letterBox) {
        letterBox.style.display = 'block';
        letterBox.style.animation = 'chat-bubble-pop 1s var(--ease-spring)';
      }
      this.launchConfetti();
    }, delay + 500);
  }

  /* ========================================================================
     10. CONFETTI EFFECT (CANVAS-BASED)
     ======================================================================== */
  setupConfetti() {
    this.confettiCanvas = document.createElement('canvas');
    this.confettiCanvas.id = 'confetti-canvas';
    this.confettiCanvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:950;display:none;';
    document.body.appendChild(this.confettiCanvas);
  }

  launchConfetti() {
    const canvas = this.confettiCanvas;
    if (!canvas) return;
    canvas.style.display = 'block';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');

    const particles = [];
    const colors = ['#E50914', '#FF2B35', '#FFD166', '#FFFFFF', '#FF85A1'];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 400,
        y: canvas.height * 0.4 + (Math.random() - 0.5) * 200,
        vx: (Math.random() - 0.5) * 14,
        vy: -Math.random() * 12 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    let frames = 0;
    const renderConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rSpeed;
        if (frames > 50) p.opacity -= 0.015;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.globalAlpha = p.opacity;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });

      frames++;
      if (alive && frames < 240) {
        requestAnimationFrame(renderConfetti);
      } else {
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    renderConfetti();
  }

  showToast(message, duration = 3200) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.35s ease';
      setTimeout(() => toast.remove(), 350);
    }, duration);
  }
}

window.InteractiveSystem = InteractiveSystem;

/* ==========================================================================
   MAIN APPLICATION COORDINATOR — INITIALIZATION & OBSERVERS
   ========================================================================== */

/* Global Asset Fallback Handler */
window.addEventListener('error', (e) => {
  if (e.target && e.target.tagName === 'IMG') {
    const src = e.target.getAttribute('src');
    if (src && !e.target.dataset.triedFallback) {
      e.target.dataset.triedFallback = 'true';
      if (!src.startsWith('/') && !src.startsWith('./')) {
        e.target.src = './' + src;
      } else if (src.startsWith('assets/')) {
        e.target.src = '/assets/' + src.replace(/^assets\//, '');
      }
    }
  }
}, true);

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Audio Engine
  const audioEngine = new window.AudioEngine();
  audioEngine.bindPlayerElements({
    playBtnId: 'soundtrack-play-btn',
    sliderId: 'soundtrack-slider',
    curTimeId: 'soundtrack-time-cur',
    durTimeId: 'soundtrack-time-dur',
    volSliderId: 'soundtrack-volume',
    muteBtnId: 'soundtrack-mute-btn',
    canvasId: 'soundtrack-waveform',
    playerCardId: 'music-player-card',
    fileInputId: 'soundtrack-file-input',
    songTitleId: 'soundtrack-title',
    songStatusId: 'soundtrack-status'
  });

  // 2. Initialize Interactive Systems
  const interactive = new window.InteractiveSystem(audioEngine);

  // 3. Render Dynamic Content Rows
  renderContinueWatching(interactive);
  renderCastBrowser(interactive);
  renderMalaysianMoments(interactive);
  renderWatchlist();
  renderMemoryMosaic();

  // 4. Initialize Carousels
  setupCarousels();

  // 5. Scroll Tracker & Nav State
  setupScrollTracking(interactive);

  // 6. Action Buttons
  setupHeroButtons(interactive);
});

/* Continue Watching Shelf Renderer */
function renderContinueWatching(interactive) {
  const track = document.getElementById('continue-watching-track');
  if (!track) return;

  track.innerHTML = NISHAMMA_DATA.continueWatching.map(ep => `
    <div class="watch-card" data-target="${ep.targetSection}" tabindex="0" role="button" aria-label="Play ${ep.title}">
      <div class="watch-card-thumbnail-box">
        <img src="${ep.image}" alt="${ep.title}" class="watch-card-img" loading="lazy">
        <div class="watch-card-badge">EP ${ep.number}</div>
        <div class="watch-card-play-overlay">
          <div class="play-circle-icon">▶</div>
        </div>
        <div class="stream-progress-bar" style="position:absolute; bottom:0; left:0; right:0;">
          <div class="stream-progress-fill" style="width: ${ep.progress}%;"></div>
        </div>
      </div>
      <div class="watch-card-info">
        <div class="watch-card-ep-num">Episode ${ep.number} • ${ep.duration}</div>
        <div class="watch-card-title">${ep.title}</div>
        <div class="watch-card-desc">${ep.desc}</div>
      </div>
    </div>
  `).join('');

  // Click to scroll to target episode
  track.querySelectorAll('.watch-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/* Cast Browser Carousel Renderer */
function renderCastBrowser(interactive) {
  const track = document.getElementById('cast-track');
  if (!track) return;

  track.innerHTML = NISHAMMA_DATA.cast.map(person => `
    <div class="cast-card" tabindex="0" role="button" aria-label="Cast member ${person.name}">
      <div class="cast-photo-wrapper">
        <img src="${person.image}" alt="${person.name}" class="cast-photo" loading="lazy">
        <div class="cast-gradient"></div>
      </div>
      <div class="cast-details">
        <div class="cast-name">${person.name}</div>
        <div class="cast-role">${person.role}</div>
        <div class="cast-relationship">${person.bio}</div>
      </div>
    </div>
  `).join('');
}

/* Malaysian Days Filmstrip Renderer */
function renderMalaysianMoments(interactive) {
  const container = document.getElementById('malaysian-moments-filmstrip');
  if (!container) return;

  container.innerHTML = NISHAMMA_DATA.malaysianMoments.map((moment, i) => `
    <div class="filmstrip-frame" onclick="openGalleryLightbox(${i})" tabindex="0" role="button" aria-label="${moment.title}">
      <img src="${moment.image}" alt="${moment.title}" class="filmstrip-img" loading="lazy">
      <div style="position:absolute; bottom:0; left:0; right:0; padding:8px; background:linear-gradient(0deg, rgba(0,0,0,0.85), transparent); font-size:0.75rem; font-weight:700;">
        ${moment.title}
      </div>
    </div>
  `).join('');
}

/* Watchlist Genre Renderer */
function renderWatchlist() {
  const grid = document.getElementById('watchlist-grid');
  if (!grid) return;

  grid.innerHTML = NISHAMMA_DATA.watchlistGenres.map(item => `
    <div class="genre-card" tabindex="0" role="button">
      <div class="genre-card-icon">${item.icon}</div>
      <div class="genre-card-title">${item.title}</div>
      <div class="genre-card-desc">${item.desc}</div>
      <div class="genre-meta-row">
        <span class="badge-match">${item.match}</span>
        <span class="badge-quality">${item.badge}</span>
      </div>
    </div>
  `).join('');
}

/* Memory Mosaic Masonry Renderer */
function renderMemoryMosaic() {
  const gallery = document.getElementById('mosaic-gallery');
  if (!gallery) return;

  gallery.innerHTML = NISHAMMA_DATA.memoryMosaic.map((item, idx) => `
    <div class="mosaic-item" onclick="openGalleryLightbox(${idx})" tabindex="0" role="button" aria-label="${item.title}">
      <img src="${item.image}" alt="${item.title}" class="mosaic-img" loading="lazy">
      <div class="mosaic-caption-overlay">
        <span class="mosaic-caption-tag">${item.tag}</span>
        <span class="mosaic-caption-text">${item.title}</span>
      </div>
    </div>
  `).join('');
}

/* Setup Carousel Controllers */
function setupCarousels() {
  const cwTrack = document.getElementById('continue-watching-track');
  const cwPrev = document.getElementById('cw-prev-btn');
  const cwNext = document.getElementById('cw-next-btn');
  if (cwTrack) new window.StreamCarousel(cwTrack, cwPrev, cwNext);

  const castTrack = document.getElementById('cast-track');
  const castPrev = document.getElementById('cast-prev-btn');
  const castNext = document.getElementById('cast-next-btn');
  if (castTrack) new window.StreamCarousel(castTrack, castPrev, castNext);
}

/* Scroll Tracker & Nav Observer */
function setupScrollTracking(interactive) {
  const progressBar = document.getElementById('scroll-progress-bar');
  const stagePillText = document.getElementById('scroll-stage-text');
  const header = document.getElementById('stream-header');

  const stages = [
    { id: 'hero-section', label: 'INTRO' },
    { id: 'episode-01', label: 'MEMORIES' },
    { id: 'episode-02', label: 'FAMILY' },
    { id: 'episode-05', label: 'GRANDMA ERA' },
    { id: 'soundtrack-section', label: 'SOUNDTRACK' },
    { id: 'finale-section', label: 'FINALE' }
  ];

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (header) {
      if (window.scrollY > 40) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    }

    // Determine current stage
    let activeStage = 'INTRO';
    for (const stage of stages) {
      const el = document.getElementById(stage.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.45) {
          activeStage = stage.label;
        }
      }
    }

    if (stagePillText && stagePillText.textContent !== activeStage) {
      stagePillText.textContent = activeStage;
    }
  }, { passive: true });

  // IntersectionObserver for Finale Sequence trigger
  const finaleEl = document.getElementById('finale-section');
  if (finaleEl) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          interactive.triggerFinaleSequence();
        }
      });
    }, { threshold: 0.3 });
    observer.observe(finaleEl);
  }
}

/* Hero Action Buttons */
function setupHeroButtons(interactive) {
  const playStoryBtn = document.getElementById('hero-play-btn');
  const myListBtn = document.getElementById('hero-my-list-btn');
  const replayBtn = document.getElementById('replay-story-btn');

  if (playStoryBtn) {
    playStoryBtn.addEventListener('click', () => {
      const ep1 = document.getElementById('episode-01');
      if (ep1) ep1.scrollIntoView({ behavior: 'smooth' });
    });
  }

  let inList = false;
  if (myListBtn) {
    myListBtn.addEventListener('click', () => {
      inList = !inList;
      myListBtn.innerHTML = inList
        ? `✓ IN MY LIST`
        : `♡ MY LIST`;
      interactive.showToast(inList ? 'Added to Nishamma Watchlist! ❤️' : 'Removed from Watchlist');
    });
  }

  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      interactive.showToast('Restarting Nishamma Original Series! 🍿');
    });
  }
}

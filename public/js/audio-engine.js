/* ==========================================================================
   AUDIO ENGINE — CINEMATIC SYNTHESIZER & SOUNDTRACK PLAYER
   ========================================================================== */

class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.soundtrackAudio = new Audio('assets/Aluva-Puzha.mp3');
    this.soundtrackAudio.preload = 'auto';
    this.isPlaying = false;
    this.isMuted = false;
    this.volume = 0.8;
    this.soundtrackAudio.volume = this.volume;

    this.analyser = null;
    this.audioSource = null;
    this.animFrameId = null;

    // DOM Elements
    this.playBtn = null;
    this.slider = null;
    this.curTimeEl = null;
    this.durTimeEl = null;
    this.volSlider = null;
    this.muteBtn = null;
    this.waveformCanvas = null;
    this.canvasCtx = null;
    this.playerCard = null;
    this.fileInput = null;
    this.headerAudioBtn = null;
  }

  startSiteAudio() {
    if (this.isPlaying) return;
    this.getAudioContext();
    const playPromise = this.soundtrackAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.updatePlayStateUI();
      }).catch(err => {
        console.log('Audio playback pending user gesture:', err);
      });
    }
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /* Original Cinematic Programmatic Sound Cue (No copyright) */
  playCinematicIntroChime() {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // 1. Deep Sub-bass Theater Swell
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(45, now);
      subOsc.frequency.exponentialRampToValueAtTime(75, now + 1.8);
      subOsc.frequency.exponentialRampToValueAtTime(32, now + 3.8);

      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.exponentialRampToValueAtTime(0.4, now + 1.2);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 4.0);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 4.2);

      // 2. Warm Brass/Cello Mid Harmonic
      const midOsc = ctx.createOscillator();
      const midGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(1400, now + 1.5);
      filter.frequency.exponentialRampToValueAtTime(250, now + 3.5);

      midOsc.type = 'sawtooth';
      midOsc.frequency.setValueAtTime(110, now); // A2
      midOsc.frequency.setValueAtTime(146.83, now + 1.0); // D3

      midGain.gain.setValueAtTime(0.001, now);
      midGain.gain.exponentialRampToValueAtTime(0.25, now + 1.0);
      midGain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

      midOsc.connect(filter);
      filter.connect(midGain);
      midGain.connect(ctx.destination);
      midOsc.start(now);
      midOsc.stop(now + 4.0);

      // 3. Shimmering Chime Arpeggio (Gold stars feeling)
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      notes.forEach((freq, idx) => {
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        const delay = 0.8 + idx * 0.14;

        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(freq, now + delay);

        chimeGain.gain.setValueAtTime(0.001, now + delay);
        chimeGain.gain.exponentialRampToValueAtTime(0.08, now + delay + 0.05);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 1.2);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(ctx.destination);
        chimeOsc.start(now + delay);
        chimeOsc.stop(now + delay + 1.3);
      });
    } catch (e) {
      console.warn('Web Audio synthesis not supported or prevented:', e);
    }
  }

  // Bind player UI controls
  bindPlayerElements({
    playBtnId,
    sliderId,
    curTimeId,
    durTimeId,
    volSliderId,
    muteBtnId,
    canvasId,
    playerCardId,
    fileInputId,
    songTitleId,
    songStatusId
  }) {
    this.playBtn = document.getElementById(playBtnId);
    this.slider = document.getElementById(sliderId);
    this.curTimeEl = document.getElementById(curTimeId);
    this.durTimeEl = document.getElementById(durTimeId);
    this.volSlider = document.getElementById(volSliderId);
    this.muteBtn = document.getElementById(muteBtnId);
    this.waveformCanvas = document.getElementById(canvasId);
    this.playerCard = document.getElementById(playerCardId);
    this.headerAudioBtn = document.getElementById('header-audio-toggle');
    if (this.headerAudioBtn) {
      this.headerAudioBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.songTitleEl) {
      this.songTitleEl.textContent = 'Aluva Puzha';
    }
    if (this.songStatusEl) {
      this.songStatusEl.textContent = "Nishamma's Theme • Official Soundtrack (Premam)";
    }

    if (this.waveformCanvas) {
      this.canvasCtx = this.waveformCanvas.getContext('2d');
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
    }

    this.setupListeners();
    this.startWaveformVisualizer();
  }

  resizeCanvas() {
    if (!this.waveformCanvas) return;
    this.waveformCanvas.width = this.waveformCanvas.parentElement.clientWidth || 300;
    this.waveformCanvas.height = 60;
  }

  setupListeners() {
    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => this.togglePlay());
    }

    if (this.slider) {
      this.slider.addEventListener('input', () => {
        if (this.soundtrackAudio.duration) {
          const seekTo = (this.slider.value / 100) * this.soundtrackAudio.duration;
          this.soundtrackAudio.currentTime = seekTo;
        }
      });
    }

    if (this.volSlider) {
      this.volSlider.addEventListener('input', () => {
        this.volume = this.volSlider.value / 100;
        this.soundtrackAudio.volume = this.volume;
        if (this.volume === 0) {
          this.isMuted = true;
          this.updateMuteIcon();
        } else if (this.isMuted) {
          this.isMuted = false;
          this.updateMuteIcon();
        }
      });
    }

    if (this.muteBtn) {
      this.muteBtn.addEventListener('click', () => {
        this.isMuted = !this.isMuted;
        this.soundtrackAudio.muted = this.isMuted;
        this.updateMuteIcon();
      });
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.loadAudioFile(file);
        }
      });
    }

    // Audio lifecycle events
    this.soundtrackAudio.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.soundtrackAudio.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    this.soundtrackAudio.addEventListener('ended', () => this.onEnded());
    this.soundtrackAudio.addEventListener('error', (e) => this.onAudioError(e));
  }

  loadAudioFile(file) {
    const url = URL.createObjectURL(file);
    this.soundtrackAudio.src = url;
    if (this.songTitleEl) {
      this.songTitleEl.textContent = file.name.replace(/\.[^/.]+$/, '');
    }
    if (this.songStatusEl) {
      this.songStatusEl.textContent = 'Custom song loaded!';
    }
    this.soundtrackAudio.play().then(() => {
      this.isPlaying = true;
      this.updatePlayStateUI();
    }).catch(e => console.log('Playback prevented:', e));
  }

  togglePlay() {
    if (!this.soundtrackAudio.src) {
      if (this.fileInput) {
        this.fileInput.click();
      }
      return;
    }

    if (this.isPlaying) {
      this.soundtrackAudio.pause();
      this.isPlaying = false;
    } else {
      this.getAudioContext();
      this.soundtrackAudio.play().then(() => {
        this.isPlaying = true;
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    }
    this.updatePlayStateUI();
  }

  updatePlayStateUI() {
    if (this.playBtn) {
      this.playBtn.innerHTML = this.isPlaying
        ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`
        : `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>`;
      this.playBtn.setAttribute('aria-label', this.isPlaying ? 'Pause' : 'Play');
    }

    if (this.headerAudioBtn) {
      if (this.isPlaying) {
        this.headerAudioBtn.classList.add('is-playing');
      } else {
        this.headerAudioBtn.classList.remove('is-playing');
      }
    }

    if (this.playerCard) {
      if (this.isPlaying) {
        this.playerCard.classList.add('is-playing');
      } else {
        this.playerCard.classList.remove('is-playing');
      }
    }
  }

  updateMuteIcon() {
    if (this.muteBtn) {
      this.muteBtn.innerHTML = this.isMuted
        ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>`
        : `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>`;
    }
  }

  onTimeUpdate() {
    const cur = this.soundtrackAudio.currentTime || 0;
    const dur = this.soundtrackAudio.duration || 0;
    if (this.slider && dur > 0) {
      this.slider.value = (cur / dur) * 100;
    }
    if (this.curTimeEl) {
      this.curTimeEl.textContent = this.formatTime(cur);
    }
  }

  onMetadataLoaded() {
    if (this.durTimeEl) {
      this.durTimeEl.textContent = this.formatTime(this.soundtrackAudio.duration);
    }
  }

  onEnded() {
    this.isPlaying = false;
    this.updatePlayStateUI();
  }

  onAudioError() {
    this.isPlaying = false;
    this.updatePlayStateUI();
    if (this.songStatusEl) {
      this.songStatusEl.textContent = 'Audio ready for your track (click "Load Song" to select)';
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  /* Waveform Visualizer */
  startWaveformVisualizer() {
    if (!this.waveformCanvas || !this.canvasCtx) return;

    let phase = 0;
    const render = () => {
      const ctx = this.canvasCtx;
      const w = this.waveformCanvas.width;
      const h = this.waveformCanvas.height;

      ctx.clearRect(0, 0, w, h);

      const numBars = 48;
      const barWidth = (w / numBars) - 2;

      for (let i = 0; i < numBars; i++) {
        let barHeight;
        if (this.isPlaying) {
          // Dynamic active waveform
          const freq = Math.sin(phase + i * 0.28) * 0.5 + 0.5;
          const noise = Math.cos(phase * 1.5 + i * 0.15) * 0.3;
          barHeight = Math.max(4, (freq + noise) * (h * 0.85));
        } else {
          // Ambient gentle pulse
          barHeight = 4 + Math.sin(phase * 0.3 + i * 0.2) * 2;
        }

        const x = i * (barWidth + 2);
        const y = h - barHeight;

        // Gradient for bars
        const grad = ctx.createLinearGradient(0, y, 0, h);
        if (this.isPlaying) {
          grad.addColorStop(0, '#FF2B35');
          grad.addColorStop(0.7, '#E50914');
          grad.addColorStop(1, '#660000');
        } else {
          grad.addColorStop(0, '#555555');
          grad.addColorStop(1, '#222222');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barHeight, 2) : ctx.rect(x, y, barWidth, barHeight);
        ctx.fill();
      }

      phase += this.isPlaying ? 0.08 : 0.02;
      this.animFrameId = requestAnimationFrame(render);
    };

    render();
  }
}

window.AudioEngine = AudioEngine;

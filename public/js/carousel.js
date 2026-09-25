/* ==========================================================================
   STREAMING CAROUSEL CONTROLLER
   ========================================================================== */

class StreamCarousel {
  constructor(trackElement, prevBtn, nextBtn) {
    this.track = trackElement;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;

    this.isDown = false;
    this.startX = 0;
    this.scrollLeft = 0;

    this.init();
  }

  init() {
    if (!this.track) return;

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', () => this.scrollBy(-340));
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', () => this.scrollBy(340));
    }

    // Mouse drag support for desktop
    this.track.addEventListener('mousedown', (e) => {
      this.isDown = true;
      this.startX = e.pageX - this.track.offsetLeft;
      this.scrollLeft = this.track.scrollLeft;
      this.track.style.cursor = 'grabbing';
      this.track.style.userSelect = 'none';
    });

    window.addEventListener('mouseup', () => {
      if (this.isDown) {
        this.isDown = false;
        this.track.style.cursor = 'grab';
        this.track.style.removeProperty('user-select');
      }
    });

    this.track.addEventListener('mousemove', (e) => {
      if (!this.isDown) return;
      e.preventDefault();
      const x = e.pageX - this.track.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      this.track.scrollLeft = this.scrollLeft - walk;
    });

    // Keyboard Arrow navigation when focused
    this.track.setAttribute('tabindex', '0');
    this.track.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        this.scrollBy(300);
      } else if (e.key === 'ArrowLeft') {
        this.scrollBy(-300);
      }
    });
  }

  scrollBy(distance) {
    this.track.scrollBy({
      left: distance,
      behavior: 'smooth'
    });
  }
}

window.StreamCarousel = StreamCarousel;

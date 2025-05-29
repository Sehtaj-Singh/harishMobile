window.addEventListener('DOMContentLoaded', () => {
  // ---------- HEADER NAVIGATION INDICATOR ----------
  const finalNavLinks = document.querySelectorAll('.final-nav .nav-link');
  const finalIndicator = document.querySelector('.final-indicator');

  function moveFinalIndicator(link) {
    if (!link || !finalIndicator) return;
    const parentRect = link.parentElement.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();
    const offsetLeft = linkRect.left - parentRect.left;

    finalIndicator.style.left = `${offsetLeft - 8}px`;
    finalIndicator.style.width = `${link.offsetWidth + 16}px`;
  }

  // ✅ URL से current path लो
  const currentPath = window.location.pathname;

  // ✅ हर nav-link पर चेक करो कि उसका href currentPath से मैच करता है
  finalNavLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
      moveFinalIndicator(link);
    } else {
      link.classList.remove('active');
    }
  });

  // ✅ Click पर भी indicator मूव हो
  finalNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      finalNavLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      moveFinalIndicator(link);
    });
  });

  // ---------- IMAGE SLIDER ----------
  const track = document.querySelector('.carousel-track');
  const dotsContainer = document.querySelector('.carousel-dots');
  if (!track || !dotsContainer) return;

  const slides = track.children;
  let startX = 0, currentTranslate = 0, prevTranslate = 0, currentIndex = 0;

  // Create dots dynamically
  for (let i = 0; i < slides.length; i++) {
    const dot = document.createElement('div');
    dot.classList.add('dot');
    if (i === 0) dot.classList.add('active');
    dotsContainer.appendChild(dot);
  }

  const dots = document.querySelectorAll('.dot');

  track.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    clearInterval(autoSlideInterval); // stop auto-slide on touch
  });

  track.addEventListener('touchmove', (e) => {
    const moveX = e.touches[0].clientX - startX;
    currentTranslate = prevTranslate + moveX;
    track.style.transform = `translateX(${currentTranslate}px)`;
  });

  track.addEventListener('touchend', () => {
    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -50 && currentIndex < slides.length - 1) currentIndex++;
    if (movedBy > 50 && currentIndex > 0) currentIndex--;

    currentTranslate = -currentIndex * slides[0].clientWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
    prevTranslate = currentTranslate;

    updateDots();

    autoSlideInterval = setInterval(autoSlide, 3000); // resume auto-slide
  });

  function updateDots() {
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
    });
  }

  function autoSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    currentTranslate = -currentIndex * slides[0].clientWidth;
    track.style.transform = `translateX(${currentTranslate}px)`;
    prevTranslate = currentTranslate;
    updateDots();
  }

  let autoSlideInterval = setInterval(autoSlide, 6000);

  // ---------- ACTIVE CLASS FOR LIST ITEMS ----------
  const list = document.querySelectorAll('.list');
  list.forEach(item =>
    item.addEventListener('click', function () {
      list.forEach(i => i.classList.remove('active'));
      this.classList.add('active');
    })
  );
});

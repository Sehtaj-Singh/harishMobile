document.addEventListener("DOMContentLoaded", () => {
  /* ===============================
     MOBILE NAV
  ================================ */
  const menuBtn = document.querySelector(".menu-btn");
  const mobileNav = document.getElementById("mobileNav");
  const closeNav = document.getElementById("closeNav");
  const navLinks = document.querySelectorAll(".mobile-nav-links a");

  if (menuBtn && mobileNav && closeNav) {
    menuBtn.addEventListener("click", () => {
      mobileNav.classList.add("active");
    });

    closeNav.addEventListener("click", () => {
      mobileNav.classList.remove("active");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("active");
      });
    });
  }

  // -------------slider--------------------

  const track = document.querySelector(".carousel-track");
  const slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".carousel-dots");

  let index = 0;
  let startX = 0;
  let currentTranslate = 0;
  let isDragging = false;

  /* ---------- DOTS ---------- */
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.addEventListener("click", () => moveToSlide(i));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".carousel-dots span");

  function updateDots() {
    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function moveToSlide(i) {
    index = Math.max(0, Math.min(i, slides.length - 1));
    const slideWidth = slides[0].offsetWidth;
    currentTranslate = -slideWidth * index;
    track.style.transform = `translateX(${currentTranslate}px)`;
    updateDots();
  }

  updateDots();

  /* ---------- TOUCH LOGIC ---------- */
  track.addEventListener("touchstart", touchStart, { passive: true });
  track.addEventListener("touchmove", touchMove, { passive: true });
  track.addEventListener("touchend", touchEnd);

  function touchStart(e) {
    startX = e.touches[0].clientX;
    isDragging = true;
  }

  function touchMove(e) {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - startX;
    track.style.transform = `translateX(${currentTranslate + diff}px)`;
  }

  function touchEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    const threshold = 50; // swipe sensitivity

    if (diff < -threshold) {
      moveToSlide(index + 1); // swipe left
    } else if (diff > threshold) {
      moveToSlide(index - 1); // swipe right
    } else {
      moveToSlide(index); // snap back
    }
  }

  /* ---------- AUTOPLAY ---------- */
  setInterval(() => {
    index = (index + 1) % slides.length;
    moveToSlide(index);
  }, 4000);

  // Dynamic footer year
  document.getElementById("currentYear").textContent = new Date().getFullYear();
});

document.addEventListener("DOMContentLoaded", () => {
  // ======================= CAROUSEL =======================

  const track = document.querySelector(".carousel-track");
  let slides = document.querySelectorAll(".slide");
  const dotsContainer = document.querySelector(".carousel-dots");

  if (track && slides.length > 0) {
    let index = 1;
    let slideWidth;
    let startX = 0;
    let isDragging = false;
    let autoPlay;

    // ===== Clone first & last =====
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);

    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    slides = document.querySelectorAll(".slide");

    // ===== Center Offset =====
    function getCenterOffset() {
      const carousel = document.querySelector(".carousel");
      const carouselWidth = carousel.offsetWidth;
      return (carouselWidth - slideWidth) / 2;
    }

    // ===== Set Initial Position =====
    function setPosition() {
      slideWidth = slides[0].offsetWidth;
      const offset = getCenterOffset();

      track.style.transition = "none";
      track.style.transform = `translateX(${-slideWidth * index + offset}px)`;

      applyActiveSlide();
    }

    window.addEventListener("resize", setPosition);
    setPosition();

    // ===== Apply Active Slide (NO CLONE ACTIVATION) =====
    function applyActiveSlide() {
      slides.forEach((s) => s.classList.remove("active-slide"));

      // Only apply to real slides
      if (!slides[index].classList.contains("clone")) {
        slides[index].classList.add("active-slide");
      }
    }

    // ===== Dots =====
    dotsContainer.innerHTML = "";
    const realSlideCount = slides.length - 2;

    for (let i = 0; i < realSlideCount; i++) {
      const dot = document.createElement("span");
      dot.addEventListener("click", () => {
        moveToSlide(i + 1);
      });
      dotsContainer.appendChild(dot);
    }

    const dots = document.querySelectorAll(".carousel-dots span");

    function updateDots() {
      dots.forEach((d) => d.classList.remove("active"));

      let dotIndex = index - 1;

      if (dotIndex < 0) dotIndex = realSlideCount - 1;
      if (dotIndex >= realSlideCount) dotIndex = 0;

      dots[dotIndex].classList.add("active");
    }

    updateDots();

    // ===== Move =====
    function moveToSlide(i) {
      index = i;
      const offset = getCenterOffset();

      track.style.transition = "transform 0.5s ease";
      track.style.transform = `translateX(${-slideWidth * index + offset}px)`;

      updateDots();
    }

    // ===== Infinite Loop Fix (NO FLICKER) =====
    track.addEventListener("transitionend", () => {
      if (slides[index].classList.contains("clone")) {
        track.style.transition = "none";

        if (index === 0) {
          index = slides.length - 2;
        } else if (index === slides.length - 1) {
          index = 1;
        }

        track.style.transform = `translateX(${-slideWidth * index + getCenterOffset()}px)`;
      }

      // Apply active AFTER final position
      applyActiveSlide();
    });

    // ===== Touch Swipe =====
    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });

    track.addEventListener("touchmove", (e) => {
      if (!isDragging) return;

      const currentX = e.touches[0].clientX;
      const diff = currentX - startX;

      track.style.transition = "none";
      track.style.transform = `translateX(${-slideWidth * index + getCenterOffset() + diff}px)`;
    });

    track.addEventListener("touchend", (e) => {
      if (!isDragging) return;
      isDragging = false;

      const endX = e.changedTouches[0].clientX;
      const diff = endX - startX;
      const threshold = 60;

      if (diff < -threshold) {
        moveToSlide(index + 1);
      } else if (diff > threshold) {
        moveToSlide(index - 1);
      } else {
        moveToSlide(index);
      }
    });

    // ===== Autoplay =====
    function startAutoPlay() {
      autoPlay = setInterval(() => {
        moveToSlide(index + 1);
      }, 5000);
    }

    startAutoPlay();
  }

  // Dynamic footer year
  const yearElement = document.getElementById("currentYear");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ========sanity====================

  const projectId = "m6ggu8sz";
  const dataset = "production";

  const query = encodeURIComponent(`
  *[_type == "mobile"]{
    _id,
    brand,
    model,
    mrp,
    discount,
    price,
    rating,
    "imageUrl": image.asset->url
  }
`);

  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      console.log("Sanity Data:", data);

      const container = document.getElementById("bnSlider");
      if (!container) return;

      container.innerHTML = "";

      data.result.forEach((item) => {
        const rating = item.rating || 0;

        const card = `
    <a class="MobileCard" href="#" data-id="${item._id || ""}">
      
      <img class="cardLogo" src="assets/images/cardLogo1.png" />

      <div id="card-image">
        ${item.imageUrl ? `<img class="mobileImage" src="${item.imageUrl}" alt="mobile image" />` : ""}
      </div>

      <div id="card-details">

        <h3 id="card-name">${item.brand || ""} ${item.model || ""}</h3>

        <p class="mobileRating">
          <span class="star-wrapper" data-rating="${rating}">
            <span class="stars-empty">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </span>
            <span class="stars-filled" style="width:${(rating / 5) * 100}%">
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
              <i class="fas fa-star"></i>
            </span>
          </span>

          <span class="rating-number">
            ${rating.toFixed(1)}
          </span>
        </p>

        <div id="card-discout">
          <div class="mobileDiscount">-${item.discount || 0}%</div>
          <div class="mobileMRP">₹${item.mrp ? item.mrp.toLocaleString("en-IN") : ""}</div>
        </div>

        <div class="finalPriceWrap">
          <div id="ribbon-wrap">
            <div class="finalPrice">
              ₹${item.price ? item.price.toLocaleString("en-IN") : ""}
            </div>
          </div>
          <div class="cornerRibbonLeft"></div>
        </div>

      </div>
    </a>
  `;

        container.innerHTML += card;
      });
    })
    .catch((error) => console.error("Error fetching Sanity data:", error));

  document.querySelectorAll(".star-wrapper").forEach(function (wrapper) {
    const rating = parseFloat(wrapper.dataset.rating) || 0;
    const pct = (rating / 5) * 100; // e.g. 4.2 -> 84
    const filled = wrapper.querySelector(".stars-filled");
    if (filled) filled.style.width = pct + "%";
  });

  // Contact Form Modal Logic

  const form = document.querySelector(".contact-form");
  const modal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // stop page reload

    // show modal
    modal.classList.add("active");

    // reset form
    form.reset();
  });

  // close modal button
  closeModal.addEventListener("click", function () {
    modal.classList.remove("active");
  });

  // close when clicking outside
  modal.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
});

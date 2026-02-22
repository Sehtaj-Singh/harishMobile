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
  }, 6000);

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

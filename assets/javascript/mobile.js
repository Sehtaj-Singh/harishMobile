document.addEventListener("DOMContentLoaded", function () {
  // ===============================
  // ===== GET SLUG FROM URL =====
  // ===============================

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    document.body.innerHTML = "<h2>Product not found</h2>";
    return;
  }

  // ===============================
  // ===== SANITY CONFIG =====
  // ===============================

  const projectId = "m6ggu8sz"; // your project ID
  const dataset = "production";

  const query = encodeURIComponent(`
    *[_type == "mobile" && slug.current == "${slug}"][0]{
      Name,
      cardData,
      mrp,
      price,
      discount,
      rating,
      razorpayButtonId,
      "detailImages": detailImages[].asset->url,
      specs
    }
  `);

  const url = `https://${projectId}.api.sanity.io/v2023-01-01/data/query/${dataset}?query=${query}`;

  // ===============================
  // ===== FETCH PRODUCT =====
  // ===============================

  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.result) {
        document.body.innerHTML = "<h2>Product not found</h2>";
        return;
      }

      renderProduct(data.result);
    })
    .catch((error) => {
      console.error("Sanity Fetch Error:", error);
      document.body.innerHTML = "<h2>Error loading product</h2>";
    });

  // ===============================
  // ===== RENDER PRODUCT =====
  // ===============================

  function renderProduct(product) {
    const fullTitle = `${product.Name || ""} ${product.cardData || ""}`;

    document.getElementById("productName").textContent = fullTitle;
    document.getElementById("cardData").textContent = "";

    document.getElementById("price").textContent = product.price
      ? "₹" + product.price.toLocaleString("en-IN")
      : "";

    document.getElementById("mrp").textContent = product.mrp
      ? "₹" + product.mrp.toLocaleString("en-IN")
      : "";

    document.getElementById("discount").textContent = product.discount
      ? "-" + product.discount + "%"
      : "";

    document.getElementById("rating").textContent = product.rating
      ? "⭐ " + product.rating + " / 5"
      : "";

    renderSlider(product.detailImages);
    renderSpecs(product.specs);
    renderRazorpayButton(product.razorpayButtonId);
  }

  // ===============================
  // ===== IMAGE SLIDER =====
  // ===============================

  function renderSlider(images) {
    const track = document.getElementById("carouselTrack");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    if (!images || images.length === 0) return;

    track.innerHTML = "";
    let currentIndex = 0;

    // Create slides
    images.forEach((imgUrl) => {
      const slide = document.createElement("div");
      slide.classList.add("carousel-slide");

      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = "Product Image";

      slide.appendChild(img);
      track.appendChild(slide);
    });

    const slides = document.querySelectorAll(".carousel-slide");

    function updatePosition() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % slides.length;
      updatePosition();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updatePosition();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    // ===== TOUCH SUPPORT =====
    let startX = 0;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;
      const diff = startX - endX;

      if (diff > 50) nextSlide();
      if (diff < -50) prevSlide();
    });

    updatePosition();
  }

  // ===============================
  // ===== RENDER SPECS =====
  // ===============================

  function renderSpecs(specs) {
    const container = document.getElementById("specsTiles");
    if (!container || !specs) return;

    container.innerHTML = "";

    const sectionMap = {
      general: "General",
      backCamera: "Rear Camera",
      memory: "Memory & Storage",
      selfieCamera: "Front Camera",
      design: "Design",
      display: "Display",
      connectivity: "Network & Connectivity",
      performance: "Performance",
      battery: "Battery",
      sound: "Sound",
      sensors: "Sensors",
    };

    for (const key in sectionMap) {
      const sectionData = specs[key];
      if (!sectionData) continue;

      const entries = Object.entries(sectionData).filter(
        ([k, v]) => v && String(v).trim() !== "",
      );

      if (!entries.length) continue;

      const tile = document.createElement("div");
      tile.classList.add("spec-tile");

      const head = document.createElement("button");
      head.classList.add("spec-head");
      head.innerHTML = `
      <span>${sectionMap[key]}</span>
      <i class="fa-solid fa-chevron-down"></i>
    `;

      const body = document.createElement("div");
      body.classList.add("spec-body");

      const list = document.createElement("ul");
      list.classList.add("spec-list");

      entries.forEach(([k, v]) => {
        const li = document.createElement("li");

        li.innerHTML = `
        <span class="spec-name">${formatLabel(k)}</span>
        <span class="spec-value">${v}</span>
      `;

        list.appendChild(li);
      });

      body.appendChild(list);
      tile.appendChild(head);
      tile.appendChild(body);

      head.addEventListener("click", () => {
        tile.classList.toggle("open");
      });

      container.appendChild(tile);
    }
  }

  // ===============================
  // ===== delivery=====
  // ===============================

  const deliveryElement = document.getElementById("delivery-date");

  const today = new Date();

  // Add 8 days
  const deliveryDate = new Date();
  deliveryDate.setDate(today.getDate() + 8);

  function getOrdinal(n) {
    if (n > 3 && n < 21) return n + "th";
    switch (n % 10) {
      case 1:
        return n + "st";
      case 2:
        return n + "nd";
      case 3:
        return n + "rd";
      default:
        return n + "th";
    }
  }

  const dayName = deliveryDate.toLocaleString("en-US", { weekday: "long" });
  const day = getOrdinal(deliveryDate.getDate());
  const month = deliveryDate.toLocaleString("en-US", { month: "long" });
  const year = deliveryDate.getFullYear();

  deliveryElement.textContent = `${dayName}, ${day} ${month} ${year}`;

  // ===============================
  // ===== RAZORPAY BUTTON =====
  // ===============================

  function renderRazorpayButton(buttonId) {
    if (!buttonId) return;

    const container = document.getElementById("razorpay-container");
    if (!container) return;

    container.innerHTML = "";

    const form = document.createElement("form");

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/payment-button.js";
    script.setAttribute("data-payment_button_id", buttonId);
    script.async = true;

    form.appendChild(script);
    container.appendChild(form);
  }

  // ===============================
  // ===== HELPERS =====
  // ===============================

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function formatLabel(str) {
    return str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  }
});

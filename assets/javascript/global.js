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
});

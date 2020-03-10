(function navToggle() {
  const navOpenBtn = document.querySelector(".nav-open-btn");
  const navCloseBtn = document.querySelector(".nav-close-btn");
  const navElm = document.querySelector(".nav");

  navOpenBtn.addEventListener("click", () => {
    navElm.classList.remove("nav--close");
  });

  navCloseBtn.addEventListener("click", () => {
    navElm.classList.add("nav--close");
  });
})();

console.log("Hello!");

(function openNav() {
  const hambBtn = document.querySelector(".hamburger-btn");
  const navCloseBtn = document.querySelector(".nav-close-btn");
  const navElm = document.querySelector(".nav");

  hambBtn.addEventListener("click", () => {
    navElm.classList.remove("nav--close");
  });

  navCloseBtn.addEventListener("click", () => {
    navElm.classList.add("nav--close");
  });
})();

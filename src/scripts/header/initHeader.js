const initHeader = () => {
    let header = document.querySelector(".header");

    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 10) {
        header.classList.add("background__white");
      } else if (window.pageYOffset <= 10) {
        header.classList.remove("background__white");
      }
    });
}

export default initHeader;
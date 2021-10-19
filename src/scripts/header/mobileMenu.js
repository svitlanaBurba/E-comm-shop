const mobileMenu = () => {
    const menuBtnRef = document.querySelector("[data-menu-button]");
    const mobileMenuRef = document.querySelector("[data-menu]");
    const mobileBtnClose = document.querySelector("[data-menu-close]");

    menuBtnRef.addEventListener("click", () => {
      mobileMenuRef.classList.toggle("mobile-menu--is-open");
      menuBtnRef.classList.toggle("mobile-menu--is-open");
    });

    mobileBtnClose.addEventListener("click", () => {
      mobileMenuRef.classList.toggle("mobile-menu--is-open");
      menuBtnRef.classList.toggle("mobile-menu--is-open");
    });
  };

  export default mobileMenu;
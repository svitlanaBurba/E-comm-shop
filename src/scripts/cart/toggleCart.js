import { getElement } from "../utils";

const cartOverlay = getElement(".cart-overlay");
const closeCartBtn = getElement(".cart__button-close");
const openCartBtn = getElement(".header__user-menu-link--cart");
const checkoutBtn = getElement('.order-btn--cart');

openCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartOverlay.classList.add("show");
});
closeCartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartOverlay.classList.remove("show");
});

//redirect to Checkout page
checkoutBtn.addEventListener("click", ()=>{location.href="checkout1.html"})

export const openCart = () => {
  cartOverlay.classList.add("show");
};

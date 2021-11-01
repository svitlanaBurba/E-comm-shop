import { validatePromoCode } from "../api/validatePromoCode";
import { getElement, getStoragePromoDiscount, setStorageItem } from "../utils";

//Promo Codes
export const initPromoCodes = applyPromo => {
    const cartPageSendBtn = document.querySelector('.cart-page__send-btn');
    const cartPagePromoInput = document.querySelector('.cart-page__promo-code-input');
  
    // display dicount code applied to a cart (if any)
    const promoDiscount = getStoragePromoDiscount();
    if (promoDiscount && promoDiscount.code !== '') {
      getElement('.cart-page__promo-msg').classList.remove('visually-hidden');
      getElement('.cart-page__promo-msg > span').textContent = promoDiscount.code;
    }
  
    // add listeners
    cartPageSendBtn.addEventListener('click', () => {
      const cartPagePromoValue = cartPagePromoInput.value;
      const promo = validatePromoCode(cartPagePromoValue);
  
      if (promo.isValid) {
        setStorageItem('promoDiscount', { code: cartPagePromoValue, discount: promo.discount });
        cartPagePromoInput.value = '';
        getElement('.cart-page__promo-msg').classList.remove('visually-hidden');
        getElement('.cart-page__promo-msg > span').textContent = cartPagePromoValue;
  
        applyPromo();
      } else {
        getElement('.cart-page__promo-msg--alert').classList.remove('visually-hidden');
      }
    });
  
    cartPagePromoInput.addEventListener('input', () => {
      getElement('.cart-page__promo-msg--alert').classList.add('visually-hidden');
    });
  
    getElement('.cart-page__promo-msg-btn').addEventListener('click', () => {
      localStorage.removeItem('promoDiscount');
      getElement('.cart-page__promo-msg').classList.add('visually-hidden');
  
      applyPromo();
    });
  };
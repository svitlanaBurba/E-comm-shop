import fetchSimilarProducts from './api/fetchSimilarProducts';
import { validatePromoCode } from './api/validatePromoCode';
import { renderCartTotal } from './cart/setupCart';
import { setupProductsGallery } from './products/setupProductsGallery';
import { getElement, getStoragePromoDiscount, setStorageItem } from './utils';

const similarProductsParams = {
  numProductsPerPage: 3,
  productsContainer: document.querySelector('.products__list.random'),
  productsBtnsContainer: document.querySelector('.btn-container.random'),
  paginatedProducts: {},
};

const onCartLoad = async () => {
  // Similar products gallery
  const similarProducts = await fetchSimilarProducts(9); //  fetch 9 (or less) similar products
  setupProductsGallery(similarProducts, similarProductsParams);
  initPromoCodes(renderCartTotal);

  getElement('.order-btn').addEventListener("click", function () {
    location.href = "checkout1.html";
  });
};

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
      setStorageItem('promoDiscount', { code: cartPagePromoValue, discount:promo.discount});
      cartPagePromoInput.value = '';
      getElement('.cart-page__promo-msg').classList.remove('visually-hidden');
      getElement('.cart-page__promo-msg > span').textContent = cartPagePromoValue;

      applyPromo();
    } else {
      getElement('.cart-page__promo-msg--alert').classList.remove('visually-hidden');
    }
  });

  cartPagePromoInput.addEventListener("input",
    () => { getElement('.cart-page__promo-msg--alert').classList.add('visually-hidden'); });
  
  getElement('.cart-page__promo-msg-btn').addEventListener('click', () => {
    localStorage.removeItem('promoDiscount');
    getElement('.cart-page__promo-msg').classList.add('visually-hidden');

    applyPromo();
  })
  
};


export default onCartLoad;

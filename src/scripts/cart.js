import fetchSimilarProducts from './api/fetchSimilarProducts';
import { initAdditionalSevices, initCreditOptions } from './cart/additionalServices';
import { initPromoCodes } from './cart/promoCodes';
import { onPromoApplied, setupCart } from './cart/setupCart';
import { setupProductsGallery } from './products/setupProductsGallery';
import { getElement } from './utils';

const similarProductsParams = {
  numProductsPerPage: 3,
  productsContainer: document.querySelector('.products__list.random'),
  productsBtnsContainer: document.querySelector('.btn-container.random'),
  paginatedProducts: {},
};

const onCartLoad = async () => {
  setupCart();
  initPromoCodes(onPromoApplied);
  initAdditionalSevices();
  initCreditOptions();

  // Similar products gallery
  const similarProducts = await fetchSimilarProducts(9); //  fetch 9 (or less) similar products
  setupProductsGallery(similarProducts, similarProductsParams);

  // checkout btn listener
  getElement('.order-btn').addEventListener('click', function () {
    location.href = 'checkout1.html';
  });
};

export default onCartLoad;

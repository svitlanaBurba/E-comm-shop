import { addToCart } from '../cart/setupCart';
import paginate from './paginate';
import { initProductPaginationBtns, renderPagesButtons } from './paginationButtons';
import { initProducts, renderProducts } from './renderProducts';

const setupProductsGallery = (products, params) => {
  renderProductsGallery(products, params);
  initProductsGallery(products, params);
};

const renderProductsGallery = (
  products,
  { paginatedProducts, numProductsPerPage, productsContainer, productsBtnsContainer },
) => {
  paginatedProducts.pages = paginate(products, numProductsPerPage);
  paginatedProducts.index = 0;

  renderProducts(productsContainer, paginatedProducts.pages[paginatedProducts.index]);

  renderPagesButtons(productsBtnsContainer, paginatedProducts.pages.length, paginatedProducts.index);
};

const initProductsGallery = (products, { paginatedProducts, productsContainer, productsBtnsContainer }) => {
  // adds 'add to cart' listener to similar products cards
  initProducts(productsContainer, selectedProductId => {
    const selectedProduct = products.find(product => product.id === Number(selectedProductId));
    addToCart(selectedProductId, selectedProduct);
  });

  // add listener to pagination buttons
  initProductPaginationBtns(productsBtnsContainer, selectedIndex => {
    paginatedProducts.index = selectedIndex;
    renderProducts(productsContainer, paginatedProducts.pages[paginatedProducts.index]);
  });
};

export { setupProductsGallery, renderProductsGallery };

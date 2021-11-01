import productsEmptyTemplate from '../../templates/productsEmptyTemplate.hbs';
import productsTemplate from '../../templates/productsTemplate.hbs';

const renderProducts = (element, products) => {
  // Render products
  element.innerHTML = products && products.length > 0 ? productsTemplate(products) : productsEmptyTemplate();
};

const initProducts = (element, onProductClick) => {
  element.addEventListener('click', function (e) {
    const btn = e.target.closest('.card__icons-btn');
    if (btn) onProductClick(Number(btn.dataset.id));
  });
};

const renderTotalProductCount = (element, products) => {
  const productCount = products.length;
  element.innerHTML = productCount + ' products';
};

export { initProducts, renderProducts, renderTotalProductCount };

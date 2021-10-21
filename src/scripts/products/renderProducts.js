
import productsTemplate from "../../templates/productsTemplate.hbs"
import productsEmptyTemplate from "../../templates/productsEmptyTemplate.hbs"

const renderProducts = (element, products) => {
  // Render products
  element.innerHTML = (products && products.length > 0) ?
   productsTemplate(products) :
   productsEmptyTemplate();

};

const initProducts = (element, onProductClick) => {
      element.addEventListener('click', function (e) {
        const parent = e.target.parentElement;
        if (parent.classList.contains('card__icons-btn')) {
          onProductClick(Number(parent.dataset.id));
        }
      });
}

export {initProducts,renderProducts};

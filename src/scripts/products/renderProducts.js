// import { formatPrice } from "../utils";
import { addToCart } from "../cart/setupCart";
import productsTemplate from "../../templates/productsTemplate.hbs"
import productsEmptyTemplate from "../../templates/productsEmptyTemplate.hbs"

const renderProducts = (products, element) => {
  // Render products
  element.innerHTML = (products && products.length > 0) ?
   productsTemplate(products) :
   productsEmptyTemplate();

   
    // Open Cart when button "cart" on the product is clicked
    element.addEventListener('click', function (e) {
      const parent = e.target.parentElement;
      if (parent.classList.contains('card__icons-btn')) {
        addToCart(parent.dataset.id);
      }
    });
};

export default renderProducts;

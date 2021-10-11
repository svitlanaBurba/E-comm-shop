// import { formatPrice } from "../utils";
import { addToCart } from "../cart/setupCart";
import productsTemplate from "../../templates/productsTemplate.hbs"


const renderProducts = (products, element, selectedCategory) => {

  const selectedCategoryProducts = selectedCategory === "All" ? 
    products : 
    products.filter( 
     product => product.categories.filter(category=> category.name===selectedCategory).length > 0
    );

  // Render products
  element.innerHTML = productsTemplate(selectedCategoryProducts);
   

    // Open Cart when button "cart" on the product is clicked
    element.addEventListener('click', function (e) {
      const parent = e.target.parentElement;
      if (parent.classList.contains('card__icons-btn')) {
        addToCart(parent.dataset.id);
      }
    });
};

export default renderProducts;

import { formatPrice } from "../utils";
import { openCart } from "../cart/toggleCart";
const renderProducts = (products, element) => {
  // Render products
  element.innerHTML = products
    .map(product => {
      const {id, name, image, price} = product;
      return ` <li class="card">
                  <div class="card__thumb">
                    <img
                      src=${image}
                      width="360"
                      height="500"
                      alt=${name}
                    />
                    <div class="card__label-wrapper">
                      <div class="card__label--sale">Sale</div>
                      <div class="card__label--new">New</div>
                    </div>
                    <div class="card__icons">
                      <a href="product.html?id=${id}" class="card__icons-link">
                        <svg class="overlay__icon--eye" width="20" height="20">
                          <use href="./assets/sprite.svg#icon-eye"></use>
                        </svg>
                      </a>
                     <button class="card__icons-btn" data-id="${id}">
                      <svg class="overlay__icon--bag" width="20" height="20">
                        <use
                          href="./assets/sprite.svg#icon-shopping-bag-white"
                        ></use>
                      </svg>
                     </button>
                    
                    </div>
                  </div>
                  <div class="card__content">
                    <h3 class="card__title">${name}</h3>
                    <p class="card__price">${formatPrice(price)}</p>
                    <a href="#" class="card__like">
                      <svg width="20" height="20">
                        <use href="./assets/sprite.svg#icon-heart"></use>
                      </svg>
                    </a>
                  </div>
              </li> `;
    })
    .join('');

    // Open Cart when button "cart" on the product is clicked
    element.addEventListener('click', function (e) {
      const parent = e.target.parentElement;
      if (parent.classList.contains('card__icons-btn')) {
        openCart();
      }
    });
};

export default renderProducts;

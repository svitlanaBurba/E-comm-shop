import { formatPrice, getElements } from '../utils.js';

const renderCartPageItem = (product) => {
  const cartList = getElements('.cart-page__product-list');

  cartList.forEach(el => el.appendChild(getCartItem(product)));
};

const getCartItem = ({ id, name, price, oldPrice, image, amount, stock }) => {
  const cartItem = document.createElement('li');
  cartItem.classList.add('cart-page__product-item');
  cartItem.setAttribute('data-id', id);
  cartItem.innerHTML = `
  <a class="cart-page__product-link" href="#">
  <img
    class="cart-page__product-photo"
    src="${image}"
    alt="${name}"
  />
</a>

<div class="cart-page__product-info">
  <div class="cart-page__product-info-header">
    <h3 class="cart-page__product-info-title">
      <a class="cart-page__product-info-title-link" href="#">${name}</a>
    </h3>
    <button class="order-card-remove-btn" data-id="${id}">
      <svg class="order-card-remove-icon" width="18" height="18">
        <use href="./assets/sprite.svg#icon-trash-o"></use>
      </svg>
    </button>
  </div>
  <div class="cart-page__product-info-body">
    <div class="cart-page__price-container">
      <div class="cart-page__price">${formatPrice(price)}</div>
      <div class="cart-page__old-price">${formatPrice(oldPrice)}</div>
    </div>

    <div class="product-page__quantity-buttons">
    <div class="stock-message--cart">${stock > 0 && stock < 5 ? `Only ${stock} item(s) left` : ''}</div>
      <button class="product-page__decrease-btn" data-id="${id}" data-stock="${stock}" data-cart-decrease-btn>
        <svg class="product-page__decrease-icon" width="15" height="15">
          <use href="./assets/sprite.svg#icon-minus"></use>
        </svg>
      </button>
      <span class="product-page__item-amount" data-id="${id}" data-stock="${stock}" data-cart-item-amount>${amount}</span>
      <button class="product-page__increase-btn" data-id="${id}" data-stock="${stock}" data-cart-increase-btn>
        <svg class="product-page__increase-icon" width="15" height="15">
          <use href="./assets/sprite.svg#icon-plus"></use> 
        </svg>
      </button>
    </div>

    <div class="cart-page__product-info-subtotal">${formatPrice(price*amount)}</div>
  </div>
</div>
    `;

  return cartItem;
};

export default renderCartPageItem;

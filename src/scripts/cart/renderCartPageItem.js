import { formatPrice, getElements } from '../utils.js';

export const renderCartPageItem = product => {
  const cartList = getElements('.cart-page__product-list');

  cartList.forEach(el => el.appendChild(getCartItem(product)));
};

const getCartItem = ({
  id,
  name,
  price,
  oldPrice,
  image,
  amount,
  stock,
  additionalServicesAvaliable,
  additionalServicesCost,
  creditData,
}) => {
  const cartItem = document.createElement('li');
  cartItem.classList.add('cart-page__product-item');
  cartItem.classList.add('cart-item');
  cartItem.setAttribute('data-id', id);
  cartItem.innerHTML = `
  <a class="cart-page__product-link" href="product.html?id=${id}">
  <img
    class="cart-page__product-photo"
    src="${image}"
    alt="${name}"
  />
</a>

<div class="cart-page__product-info">
  <div class="cart-page__product-info-header">
    <h3 class="cart-page__product-info-title">
      <a class="cart-page__product-info-title-link" href="product.html?id=${id}">${name}</a>
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
      <span class="product-page__item-amount cart-item-amount" data-id="${id}" data-stock="${stock}" data-cart-item-amount>${amount}</span>
      <button class="product-page__increase-btn" data-id="${id}" data-stock="${stock}" data-cart-increase-btn>
        <svg class="product-page__increase-icon" width="15" height="15">
          <use href="./assets/sprite.svg#icon-plus"></use> 
        </svg>
      </button>
    </div>

    <div class="cart-page__product-info-subtotal">${formatPrice(price * amount)}</div>
  </div>
   <div class="cart-page__product-services ${additionalServicesCost > 0 ? '' : 'display-none'}">
      <span class="cart-page__product-services-label">Additional services: </span>
      <span class="cart-page__product-services-cost">${formatPrice(additionalServicesCost)}</span>
  </div>
  <div class="cart-page__product-credit ${creditData ? '' : 'display-none'}">
    <span class="cart-page__product-credit-label">Payment in installments: </span>
    <span class="cart-page__product-credit-numpayments">${creditData ? creditData.numPayments : ''}</span>
    x
    <span class="cart-page__product-credit-payment">${creditData ? formatPrice(creditData.payment * amount) : ''}</span>
  </div>
  <div class="cart-page__product-addinfo">
      <button class="cart-addinfo-btn--options" type="submit" data-id="${id}" ${
    !additionalServicesAvaliable ? 'style="visibility:hidden"' : ''
  } >additional services</button>
      <button class="cart-addinfo-btn--credit" type="submit" data-id="${id}">buy in credit</button>
  </div>
</div>
    `;

  return cartItem;
};

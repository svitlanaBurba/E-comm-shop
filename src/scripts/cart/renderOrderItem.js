import { formatPrice, getElements } from '../utils.js';

const renderOrderItem = product => {
  const orderList = getElements('.checkout-order__product-list');

  orderList.forEach(el => el.appendChild(getCartItem(product)));
};

const getCartItem = ({ id, name, price, oldPrice, image, amount, stock }) => {
  const orderItem = document.createElement('li');
  orderItem.classList.add('order-card');
  orderItem.classList.add('cart-item');
  orderItem.setAttribute('data-id', id);
  orderItem.innerHTML = `
            <a class="order-card__link" href="product.html?id=${id}">
                <img
                class="order-card__photo"
                src="${image}"
                alt="${name}"
                />
            </a>
            <div class="order-card__info">
                <h3 class="order-card__title">
                <a class="order-card__title-link" href="product.html?id=${id}">${name}</a>
                </h3>
                <span class="order-card__new-price">${formatPrice(price)}</span>
                <span class="order-card__old-price">${formatPrice(oldPrice)}</span>
            </div>
            <span class="order-multiply">x</span>
            <span class="cart-item-amount order-item-amount" data-id="${id}" data-stock="${stock}" data-cart-item-amount>${amount}</span>
    `;

  return orderItem;
};

export default renderOrderItem;

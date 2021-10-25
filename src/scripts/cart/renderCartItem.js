import { formatPrice, getElements } from '../utils.js';

const renderCartItem = ({ id, name, price, oldPrice, image, amount }) => {
  const cartList = getElements('.order__product-list');

  cartList.forEach(el=>
        el.appendChild(
            getCartItem(id, name, price, oldPrice, image, amount))
        );
};

const getCartItem = ( id, name, price, oldPrice, image, amount ) => { 
    const cartItem = document.createElement('li');
    cartItem.classList.add('order-card');
    cartItem.setAttribute('data-id', id);
    cartItem.innerHTML = `
            <a class="order-card__link" href="#">
                <img
                class="order-card__photo"
                src="${image}"
                alt="${name}"
                />
            </a>
            <div class="order-card__info">
                <h3 class="order-card__title">
                <a class="order-card__title-link" href="">${name}</a>
                </h3>
                <span class="order-card__new-price">${formatPrice(price)}</span>
                <span class="order-card__old-price">${formatPrice(oldPrice)}</span>
            </div>
            <div class="order-card-buttons">
                <button class="order-card-decrease-btn" data-id="${id}">
                <svg class="order-card-decrease-icon" width="15" height="15">
                    <use href="./assets/sprite.svg#icon-minus"></use>
                </svg>
                </button>
                <span class="cart-item-amount" data-id="${id}">${amount}</span>
                <button class="order-card-increase-btn" data-id="${id}">
                <svg class="order-card-increase-icon" width="15" height="15">
                    <use href="./assets/sprite.svg#icon-plus"></use>
                </svg>
                </button>
                <button class="order-card-remove-btn" data-id="${id}">
                <svg class="order-card-remove-icon" width="18" height="18">
                    <use href="./assets/sprite.svg#icon-trash-o"></use>
                </svg>
                </button>
            </div>
    `;

    return cartItem;
}

export default renderCartItem;
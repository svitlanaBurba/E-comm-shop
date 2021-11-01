import { fetchDeliveryCost } from '../api/fetchDeliveryCost';
import { formatPrice, getElement, getElements, getStoragePromoDiscount, hideElement, unHideElement } from '../utils';
import renderCartItem from './renderCartItem';
import { renderCartPageItem } from './renderCartPageItem';

const cartUserMenuCount = getElement('.header__user-menu-count--cart');
const cartOrderTotals = getElements('.order-summary__text--price');
const cartOrderPromo = getElements('.order-summary__text--promo');
const cartOrderServices = getElements('.order-summary__text--services');
const cartOrderDelivery = getElements('.order-summary__text--delivery');
const cartTotals = getElements('.order-summary__amount');

// render all Cart items items from the Local Storage
export const renderCart = cart => {
  document.querySelectorAll('.order__product-list').innerHTML = '';
  document.querySelectorAll('.cart-page__product-list').innerHTML = '';

  cart.forEach(cartItem => {
    renderCartItem(cartItem);
    renderCartPageItem(cartItem);
  });

  renderCartTotal(cart);
  renderCartItemCount(cart);
};

// render Cart Total
export const renderCartTotal = cart => {
  const promoDiscount = getStoragePromoDiscount().discount;

  const productsCost = cart.reduce((acc, { price, amount }) => (acc += price * amount), 0);
  const discount = promoDiscount !== 0 ? -1 * productsCost * promoDiscount : 0; // discount is negative!
  const servicesCost = cart.reduce((total, item) => total + (item.additionalServicesCost || 0), 0);
  const deliveryCost = fetchDeliveryCost(productsCost + discount + servicesCost);
  const total = productsCost + discount + servicesCost + deliveryCost; // discount is negative, so adding it

  cartOrderTotals.forEach(el => (el.textContent = formatPrice(productsCost)));
  cartOrderPromo.forEach(el => (el.textContent = formatPrice(discount)));
  cartOrderServices.forEach(el => (el.textContent = formatPrice(servicesCost)));
  cartOrderDelivery.forEach(el => (el.textContent = formatPrice(deliveryCost)));
  cartTotals.forEach(el => (el.textContent = formatPrice(total)));
};

// render items count in user-menu
export const renderCartItemCount = cart => {
  const totalAmount = cart.reduce((acc, cartItem) => (acc += cartItem.amount), 0);
  cartUserMenuCount.textContent = totalAmount;
};

// updating cartItem elements (amount etc) on page and sidebar after change of amount or adding additional services
// we use this as an alternative to re-rendering the whole cart or cartItem
export const updateCartItemOnPage = (cart, productId) => {
  if (!cart || !productId) return;
  const cartItem = cart.find(item => item.id === productId);

  // update totals before updating the items data
  renderCartTotal(cart);
  renderCartItemCount(cart);

  // if there is no such productId in cart anymore - then remove it from pages
  if (!cartItem) {
    document.querySelectorAll(`.cart-item[data-id='${productId}']`).forEach(itemContainer => itemContainer.remove());
    return;
  }

  const itemContainers = getElements(`.cart-item[data-id='${cartItem.id}']`);

  // if this cartItem is not represented on pages yet (just added) - add it to pages
  if (itemContainers.length === 0) {
    renderCartItem(cartItem);
    renderCartPageItem(cartItem);
  }

  // update data for this item on pages
  itemContainers.forEach(itemContainer => {
    if (cartItem.amount === 0) {
      itemContainer.remove();
    } else {
      // update amount (if qty was changed)
      itemContainer.querySelectorAll('.cart-item-amount').forEach(element => {
        element.textContent = cartItem.amount;
      });

      // update subtotal
      itemContainer.querySelectorAll('.cart-page__product-info-subtotal').forEach(element => {
        element.textContent = formatPrice(cartItem.amount * cartItem.price);
      });

      // update/hide additional services
      if (cartItem.additionalServicesCost > 0) {
        // update cost
        itemContainer.querySelectorAll('.cart-page__product-services-cost').forEach(element => {
          element.textContent = formatPrice(cartItem.additionalServicesCost);
        });
        unHideElement('.cart-page__product-services', itemContainer);
      } else {
        hideElement('.cart-page__product-services', itemContainer);
      }

      // update/hide credit section
      if (cartItem.creditData) {
        // num payments
        itemContainer.querySelectorAll('.cart-page__product-credit-numpayments').forEach(element => {
          element.textContent = cartItem.creditData.numPayments;
        });
        // payment size
        itemContainer.querySelectorAll('.cart-page__product-credit-payment').forEach(element => {
          element.textContent = formatPrice(cartItem.creditData.payment * cartItem.amount);
        });

        unHideElement('.cart-page__product-credit', itemContainer);
      } else {
        hideElement('.cart-page__product-credit', itemContainer);
      }
    }
  });
};

import { formatDate, formatPrice, hideElements, unHideElements } from '../utils';
import renderCartItem from './renderCartItem';
import { renderCartPageItem } from './renderCartPageItem';
import renderOrderItem from './renderOrderItem';
import { getCartTotals } from './utils';



// render all Cart items items from the Local Storage
export const renderCart = cart => {
  document.querySelectorAll('.order__product-list').innerHTML = '';
  document.querySelectorAll('.cart-page__product-list').innerHTML = '';

  cart.forEach(cartItem => {
    renderCartItem(cartItem);
    renderCartPageItem(cartItem);
    renderOrderItem(cartItem);
  });

  renderCartTotal(getCartTotals(cart));
};

// (re)render Cart Total
export const renderCartTotal = cartTotals => {
  const cartOrderTotals = document.querySelectorAll('.order-summary__text--price');
  const cartOrderPromo = document.querySelectorAll('.order-summary__text--promo');
  const cartOrderServices = document.querySelectorAll('.order-summary__text--services');
  const cartOrderDelivery = document.querySelectorAll('.order-summary__text--delivery');
  const cartOrderDeliveryDate = document.querySelectorAll('.order-summary__text--delivery-date');
  const cartGrandTotals = document.querySelectorAll('.order-summary__amount');
  const cartUserMenuCount = document.querySelectorAll('.header__user-menu-count--cart');

  cartOrderTotals.forEach(el => (el.textContent = formatPrice(cartTotals.productsCost)));
  cartOrderPromo.forEach(el => (el.textContent = formatPrice(cartTotals.discount)));
  cartOrderServices.forEach(el => (el.textContent = formatPrice(cartTotals.servicesCost)));
  cartOrderDelivery.forEach(el => (el.textContent = formatPrice(cartTotals.deliveryCost,undefined,'-')));
  cartOrderDeliveryDate.forEach(el => (el.textContent = formatDate(cartTotals.deliveryDate,'')));
  cartGrandTotals.forEach(el => (el.textContent = formatPrice(cartTotals.totalCost,undefined,'-')));
  cartUserMenuCount.forEach(el => (el.textContent = cartTotals.totalItemCount));
};


// updating cartItem elements (amount etc) on page and sidebar after change of amount or adding additional services
// we use this as an alternative to re-rendering the whole cart or cartItem
export const updateCartItemOnPage = (cart, productId) => {
  if (!cart || !productId) return;
  const cartItem = cart.find(item => item.id === productId);

  // update totals before updating the items data
  renderCartTotal(getCartTotals(cart));

  // look for product cards that are already on pages
  const itemContainers = document.querySelectorAll(`.cart-item[data-id='${productId}']`);

  // if there is no such productId in cart anymore - then remove it from pages
  if (!cartItem) {
    itemContainers.forEach(itemContainer => itemContainer.remove());
    return;
  }

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
        unHideElements('.cart-page__product-services', itemContainer);
      } else {
        hideElements('.cart-page__product-services', itemContainer);
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

        unHideElements('.cart-page__product-credit', itemContainer);
      } else {
        hideElements('.cart-page__product-credit', itemContainer);
      }
    }
  });
};

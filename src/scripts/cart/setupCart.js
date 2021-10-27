import fetchProductById from '../api/fetchProductById.js';
import { formatPrice, getElement, getElements, getStorageItem, setStorageItem, getStoragePromoDiscount } from '../utils';
import renderCartItem from './renderCartItem';
import renderCartPageItem from './renderCartPageItem.js';
import { openCart } from './toggleCart';

const cartUserMenuCount = getElement('.header__user-menu-count--cart');
const cartLists = getElements('.cart__product-list');
const cartOrderTotals = getElements('.order-summary__text--price');
const cartOrderPromo = getElements('.order-summary__text--promo');
const cartOrderDelivery = getElements('.order-summary__text--delivery');
const cartTotals = getElements('.order-summary__amount');

let cart = getStorageItem('cart');

export const addToCart = async (id, productData, numToAdd) => {
  id = Number(id);
  if (numToAdd === 0) return;
// check if we have stock
  if (productData.stock === 0) return;

  let item = cart.find(cartItem => cartItem.id === Number(id));
  const numItemsToAdd = numToAdd > 1 ? numToAdd : 1;

  if (!item) {
    // if product details were not provided - fetch them from backend by id
    let product = productData || (await fetchProductById(id));
    //   adding amount field to the item
    product = { ...product, amount: numItemsToAdd };

    //   adding item to the cart
    cart = [...cart, product];
    //   render item to the DOM;
    renderCartItem(product);
    renderCartPageItem(product);
  } else {
    // update values
    const amount = increaseAmount(id, numItemsToAdd, productData.stock);
    //tranforming nodelist into array
    const cartItems = [...document.querySelectorAll('[data-cart-item-amount]')];
    //updating amount in DOM without page refreshing
    const existingCartItem = cartItems.find(cartItem => Number(cartItem.dataset.id) === id);

    existingCartItem.textContent = amount;
  }
  // adding numbers one to the items count in user-menu
  renderCartItemCount();
  // render Cart Total
  renderCartTotal();
  // set cart in Local storage so that to get access to it in every page
  setStorageItem('cart', cart);
  openCart();
};

// render items count in user-menu
function renderCartItemCount() {
  const totalAmount = cart.reduce((acc, cartItem) => (acc += cartItem.amount), 0);
  cartUserMenuCount.textContent = totalAmount;
}

// render Cart Total
export function renderCartTotal() {
  const promoDiscount = getStoragePromoDiscount().discount;
  const total = cart.reduce((acc, { price, amount }) => (acc += price * amount), 0);

  let delivery = 0;
  if (total > 0 && total <= 100) {
    delivery = 10;
  } else if (total > 100 && total <= 1000) {
    delivery = 5;
  }
  else delivery = 0;

  cartOrderTotals.forEach(el => (el.textContent = formatPrice(total)));
  cartOrderPromo.forEach(el => (el.textContent = formatPrice(total*promoDiscount)));
  cartOrderDelivery.forEach(el => (el.textContent = formatPrice(delivery)));
  cartTotals.forEach(el => (el.textContent = formatPrice(total - total*promoDiscount + delivery)));
}

// render all Cart items items from the Local Storage
function renderCart() {
  cart.forEach(cartItem => { renderCartItem(cartItem); renderCartPageItem(cartItem);});
}

// increasing cartItem 
function increaseAmount(id, numToAdd, stock) {
  let newAmount;
  cart = cart.map(cartItem => {
    if (cartItem.id === Number(id)) {
      newAmount = Math.min(cartItem.amount + (numToAdd || 1), stock);
      cartItem = { ...cartItem, amount: newAmount };
    }
    return cartItem;
  });
  return newAmount;
}

// decreasing cartItem 
function decreaseAmount(id) {
  let newAmount;
  cart = cart.map(cartItem => {
    if (cartItem.id === Number(id)) {
      newAmount = Math.max(cartItem.amount - 1, 0);
      cartItem = { ...cartItem, amount: newAmount };
    }
    return cartItem;
  });
  return newAmount;
}

// removing cartItem from Local Storage
function removeCartItem(id) {
  cart = cart.filter(cartItem => cartItem.id !== Number(id));
}

function activateCartButtons() {
  cartLists.forEach(cartList => cartList.addEventListener('click', e => {
    const parent = e.target.closest('button');
    if (!parent) return;
    const parentId = parent.dataset.id;
    const stock = parent.dataset.stock;

    // removing cartItem
    if (parent.classList.contains('order-card-remove-btn')) {
      removeCartItem(parentId);
      // removing cartItem from the DOM
      parent.closest('li').remove();
    }
    // increasing cartItem
    if (parent.hasAttribute('data-cart-increase-btn')) {
      const newAmount = increaseAmount(parentId, 1, stock);
      // increasing cartItem in the DOM
      parent.previousElementSibling.textContent = newAmount;
    }
    // decreasing cartItem
    if (parent.hasAttribute('data-cart-decrease-btn')) {
      const newAmount = decreaseAmount(parentId);
      if (newAmount === 0) {
        removeCartItem(parentId);
        parent.closest('li').remove();
      } else {
        parent.nextElementSibling.textContent = newAmount;
      }
    }

    renderCartItemCount();
    renderCartTotal();
    setStorageItem('cart', cart);
  }));
}

const start = () => {
  // render items count in user-menu
  renderCartItemCount();
  // render Cart Total
  renderCartTotal();
  // render all Cart items items from the Local Storage
  renderCart();
  // activate Cart buttons

  activateCartButtons();
};

start();

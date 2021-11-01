import fetchProductById from '../api/fetchProductById.js';
import { getElements, getStorageItem, setStorageItem } from '../utils';
import { renderCart, renderCartTotal, updateCartItemOnPage } from './renderCart.js';
import { openCart } from './toggleCart';

const cartLists = getElements('.cart__product-list');
let cart = getStorageItem('cart');

export const addToCart = async (id, productData, numToAdd) => {
  id = Number(id);
  if (numToAdd === 0) return;
  const numItemsToAdd = numToAdd > 1 ? numToAdd : 1;

  // if product details were not provided - fetch them from backend by id
  let product = productData || (await fetchProductById(id));
  if (!product) return;

  // check if we have stock
  if (product.stock === 0) return;

  // check if we already have this product in cart
  let item = cart.find(cartItem => cartItem.id === id);
  // if product is not in cart yet - add it, otherwise increase it's qty
  if (!item) {
    //   adding amount field to the item
    const cartItem = { ...product, amount: numItemsToAdd };
    //   adding item to the cart
    cart = [...cart, cartItem];
    // save
    setStorageItem('cart', cart);
    //   render item - add to the cart lists
    updateCartItemOnPage(cart, id);
  } else {
    // increase num in cart on 1
    increaseCartItemAmount(id, numItemsToAdd, productData.stock);
  }
  openCart();
};

// increasing cartItem
function increaseCartItemAmount(productId, numToAdd) {
  const itemIndex = cart.findIndex(item => item.id === Number(productId));
  if (itemIndex === undefined) return;
  let cartItem = cart[itemIndex];

  cartItem.amount = Math.min(cartItem.amount + (numToAdd || 1), cartItem.stock || 999);
  calculateCartItemAdditionalServicesCost(cartItem);
  // save
  setStorageItem('cart', cart);
  // update pages
  updateCartItemOnPage(cart, productId);
  return cartItem.amount;
}

// decreasing cartItem
function decreaseCartItemAmount(productId) {
  let cartItem = cart.find(item => item.id === Number(productId));
  if (!cartItem) return;

  cartItem.amount = Math.max(cartItem.amount - 1, 0);

  if (cartItem.amount !== 0) {
    calculateCartItemAdditionalServicesCost(cartItem);
    // save
    setStorageItem('cart', cart);
    // update pages
    updateCartItemOnPage(cart, productId);
  } else {
    // if new amount is 0 them remove item from cart
    removeCartItem(productId);
  }
  return cartItem.amount;
}

// removing cartItem from Local Storage
function removeCartItem(productId) {
  cart = cart.filter(cartItem => cartItem.id !== Number(productId));
  // save
  setStorageItem('cart', cart);
  // update pages - remove items from sidebar and cart page
  updateCartItemOnPage(cart, productId);
}

function activateCartButtons() {
  cartLists.forEach(cartList =>
    cartList.addEventListener('click', e => {
      const parent = e.target.closest('button');
      if (!parent) return;
      const productId = Number(parent.dataset.id);

      // removing cartItem
      if (parent.classList.contains('order-card-remove-btn')) removeCartItem(productId);
      // increasing cartItem
      if (parent.hasAttribute('data-cart-increase-btn')) increaseCartItemAmount(productId, 1);
      // decreasing cartItem
      if (parent.hasAttribute('data-cart-decrease-btn')) decreaseCartItemAmount(productId);
    }),
  );
}

export const updateCartItemAdditionalServices = (productId, selectedServicesIds) => {
  let cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  cartItem.additionalServices.forEach(service => {
    service.selected = selectedServicesIds.findIndex(id => id === service.id) > -1;
  });
  // recalculate
  calculateCartItemAdditionalServicesCost(cartItem);
  // save
  setStorageItem('cart', cart);
  // update page
  updateCartItemOnPage(cart, productId);
};

export const updateCartItemCreditData = (productId, creditData) => {
  let cartItem = cart.find(item => item.id === productId);
  if (!cartItem) return;

  cartItem.creditData = creditData;
  //save
  setStorageItem('cart', cart);
  // update pages
  updateCartItemOnPage(cart, productId);
};

const calculateCartItemAdditionalServicesCost = cartItem => {
  cartItem.additionalServicesCost =
    cartItem.amount *
    cartItem.additionalServices.reduce((total, service) => (service.selected ? total + service.cost : total), 0);
};

export const onPromoApplied = () => {
  renderCartTotal(cart);
};

export const setupCart = () => {
  let cart = getStorageItem('cart');
  renderCart(cart);
  activateCartButtons();
};

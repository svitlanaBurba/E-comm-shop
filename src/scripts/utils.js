import { nanoid } from 'nanoid';
//targeting the element
const getElement = selection => {
  const element = document.querySelector(selection);
  if (element) return element;
  throw new Error(`Please check "${selection}" selector, there is no such element`);
};

const getElements = selection => {
  const elements = document.querySelectorAll(selection);
  if (elements) return elements;
  throw new Error(`Please check "${selection}" selector, there is no such element`);
};

//Local Storage
const getStorageItem = item => {
  let storageItem = localStorage.getItem(item);
  if (storageItem) {
    storageItem = JSON.parse(localStorage.getItem(item));
  } else {
    storageItem = [];
  }
  return storageItem;
};

// Setting products to the Local Storage aw well as Car>t items
const setStorageItem = (name, item) => {
  localStorage.setItem(name, JSON.stringify(item));
};

//Price formating
const formatPrice = (price, textIfZero, textInUndefined) => {
  // if price is not defined - return placeholder (if provided)
  if (price === undefined && textInUndefined) return textInUndefined;
  // if price is 0 - return special text (if provided)
  if (price === 0 && textIfZero) return textIfZero;

  let formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(price);
  return formattedPrice;
};

//Get PromoDiscount from Local Storage
const getStoragePromoDiscount = () => {
  let storageItem = localStorage.getItem('promoDiscount');
  if (storageItem) {
    return JSON.parse(storageItem);
  } else {
    return { code: '', discount: 0 };
  }
};

const hideElements = (selector, container) => {
  const parent = container || document;
  const els = parent.querySelectorAll(selector);
  els.forEach(el => el.classList.add('display-none'));
};

const unHideElements = (selector, container) => {
  const parent = container || document;
  const els = parent.querySelectorAll(selector);
  els.forEach(el => el.classList.remove('display-none'));
};

const cleanLocalStorageIfTooOld = () => {
  const today = new Date();
  const lastVisited = window.localStorage.getItem('lastvisited');
  const daysPassed = (today - Date.parse(lastVisited)) / (1000 * 60 * 60 * 24);

  if (!lastVisited || daysPassed >= 1) window.localStorage.clear();

  window.localStorage.setItem('lastvisited', today);
};

export const generateOrderId = () => {
  return nanoid().toUpperCase().substring(0, 6);
};

export const getFormData = form => {

  if (!form || form.tagName.toLowerCase() !== 'form') return;

  const formData = new FormData(form);
  //transforming key-value pairs into an object
  const formObject = Object.fromEntries(formData.entries());
  //forming Json for form data object
  return formObject;
};

export {
  getElement,
  getElements,
  getStorageItem,
  setStorageItem,
  formatPrice,
  getStoragePromoDiscount,
  hideElements,
  unHideElements,
  cleanLocalStorageIfTooOld,
};

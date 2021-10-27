//targeting the element
const getElement = (selection) => {
    const element = document.querySelector(selection);
    if (element) return element;
    throw new Error(
      `Please check "${selection}" selector, there is no such element`
    );
};

const getElements = (selection) => {
  const elements = document.querySelectorAll(selection);
  if (elements) return elements;
  throw new Error(
    `Please check "${selection}" selector, there is no such element`
  );
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

// Setting products to the Local Storage aw well as Cart items
const setStorageItem = (name, item) => {
  localStorage.setItem(name, JSON.stringify(item));
};

//Price formating
const formatPrice = price => {
  let formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
  return formattedPrice;
};

//Get PromoDiscount from Local Storage
const getStoragePromoDiscount= () => {
  let storageItem = localStorage.getItem('promoDiscount');
  if (storageItem) {
    return JSON.parse(storageItem);
  } else {
    return {code:'', discount:0};
  }
};



  export {getElement,getElements, getStorageItem, setStorageItem, formatPrice, getStoragePromoDiscount};
import { getStorageItem, setStorageItem } from './utils.js';

//Accessing products from the Local Storage
let store = getStorageItem('store');

// Transforming the array and Setting products to the Local Storage
const setupStore = products => {
  store = products.map(product => {

    const {
      id, name, price, image, categories, popular
    } = product;
    return {id, name, price, image, categories, popular};

  });
  setStorageItem('store', store);
};

const findProduct = id => {
  let product = store.find(product => product.id === id);
  return product;
};

export {store, setupStore, findProduct};

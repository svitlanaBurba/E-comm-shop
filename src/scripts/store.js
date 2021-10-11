import { getStorageItem, setStorageItem } from './utils.js';

//Accessing products from the Local Storage
let store = getStorageItem('store');

// Transforming the array and Setting products to the Local Storage
const setupStore = products => {
  store = products.data.map(product => {

    const {
      id, name, price, image, categories
    } = product;
    return {id, name, price, image, categories};

  });
  setStorageItem('store', store);
};

//if the item is not in the cart, then find the product by Id in the store 
//so that to add the product to the cart
const findProduct = id => {
  let product = store.find(product => product.id === Number(id));
  return product;
};

export {store, setupStore, findProduct};

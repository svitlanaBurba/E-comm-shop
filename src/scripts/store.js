
import { getStorageItem, setStorageItem } from './utils.js';

//Accessing products from the Local Storage
let store = getStorageItem('store');
let categories = getStorageItem('categories');

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

const setupCategories = (categories, categoryImages) => {
  // first category in a list is our main category (others are it's sub categories), so we can rename it to "All"
  categories[0].name = "All";

  // if array with category images was provided then enrich with image links - for main page only
  if (categoryImages) {
    categories.forEach( (category, index) => category.img = categoryImages[index].webformatURL);
  }

  let filteredCategories = categories.filter(category=>category.count>0);

  setStorageItem('categories', filteredCategories);
  return filteredCategories;
};



//if the item is not in the cart, then find the product by Id in the store 
//so that to add the product to the cart
const findProduct = id => {
  let product = store.find(product => product.id === Number(id));
  return product;
};

export {store,categories, setupStore, findProduct, setupCategories};

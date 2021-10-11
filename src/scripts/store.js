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

const setupCategories = (products, categoryImages) => {
  let productCategories = [
    ...new Set(products.flatMap(product => product.categories.map(category=>category.name)))
  ];

  categories =  productCategories.map(category => ({
      name: category,
      count: products.filter(product=>product.categories.filter(e => e.name === category).length>0).length
    })
  );

  categories = [{name:"All", count: products.length},...categories];
  
  // if array with category images was provided then enrich with image links - for main page only
  if (categoryImages) {
    categories.forEach( (category, index) => category.img = categoryImages[index].webformatURL);
  }
  setStorageItem('categories', categories);
};

//if the item is not in the cart, then find the product by Id in the store 
//so that to add the product to the cart
const findProduct = id => {
  let product = store.find(product => product.id === Number(id));
  return product;
};

export {store,categories, setupStore, findProduct, setupCategories};

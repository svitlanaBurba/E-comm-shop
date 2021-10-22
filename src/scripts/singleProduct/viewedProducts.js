import { getStorageItem, setStorageItem } from "../utils";

const numViewedProductsToStore = 10; // we don't want to store more than 10 viewed products in local storage

export const addProductToViewedList = (productToAdd) => {
    let viewedProducts = getStorageItem("viewedProducts");
    // if product exists in the array - delete it (so that we will add it at the start)
    let i = viewedProducts.findIndex((product) => product.id === productToAdd.id);
    if (i !== -1) viewedProducts.splice(i, 1);
  
    viewedProducts.unshift(productToAdd);
    setStorageItem(
      "viewedProducts",
      viewedProducts.slice(0, numViewedProductsToStore)
    );
  };

export const getViewedProducts = (numProducts) => {
  return getStorageItem("viewedProducts").slice(0,numProducts);
}
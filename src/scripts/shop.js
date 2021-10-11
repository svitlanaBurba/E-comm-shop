// import * as $ from 'jquery';

import { toggleShopSidebar } from './filters/toggleShopSidebar';
import fetchProducts from './products/fetchProducts';
import {setupStore, store, categories, setupCategories} from './store.js';
import renderProducts from './products/renderProducts.js';
import setupProductCategories from './filters/productCategories';


const onShopLoad = () => {
  toggleShopSidebar();
  setupProductsSection();
};


// renders whole products section - list of products and list of categories (works as a filter)
const setupProductsSection = async () => {
      // get selected category from a page URL (hash)
      let selectedCategory = decodeURI(window.location.hash.substring(1));   

      const products = await fetchProducts();   

      if (products) {
        // add products and categories to the store
        setupStore(products);
        setupCategories(store);

        // if selected category does not exist in a list of categories - set it to "All"
        if (categories.filter(category => category.name === selectedCategory).length ===0) {
          selectedCategory = "All";
        }

        // render products section
        renderSelectedProducts(selectedCategory);
        // render categories buttons list
        setupProductCategories(categories, renderSelectedProducts, selectedCategory);  
      }
}

// this will render products for the selected category
// it is not expected that list of products will change until page refreshes
const renderSelectedProducts = selectedCategory => {
  renderProducts(store, document.querySelector('.products__list'), selectedCategory);
}


  export default onShopLoad;
import fetchProducts from './api/fetchProducts';
import fetchFilterParameters from '../scripts/api/fetchFilterParameters'
import { toggleShopSidebar } from './filters/toggleShopSidebar';
import {setupStore} from './store.js';

import renderProducts from './products/renderProducts.js';
import setupProductCategories from './filters/productCategories';
import setupProductManufacturers from './filters/productManufacturers';
import initSlider from '../components/rangeSlider';

import paginate from './products/paginate';
import {initProductPaginationBtns,renderPagesButtons} from './products/paginationButtons'
import initSearch from '../scripts/filters/searchProducts'


let filtersApplied = {}
let filterParameters = {};
let matchingProducts = {};

const productsPerPage = 6;

const btnContainer = document.querySelector('.btn-container');
const sliderContainer = document.querySelector('.shop-sidebar__slider-container');
const sortSelectContainer = document.querySelector('.form-relevance__select');
const totalProductCountContainer = document.querySelector('.shop__header-quantity');
const productsGridContainer = document.querySelector('.products__list');
const searchInputElement = document.querySelector('.form-search__input');

const onShopLoad = async () => {
  // load filter params - full list of available categories, manufacturers, min and max prices
  filterParameters = await fetchFilterParameters();
  // get selected category if specified in URL (when coming from the main page)
  filtersApplied.categoryId = getSelectedCategoryFromUrl();

  // load and render products, init pagination buttons
  setupProductsGrid(filtersApplied);

  // render and setup all the filters sections
  setupProductCategorySection(); // by category
  setupManufacturerSection(); // by manufacturer
  initPriceSlider(); // by price - slider
  initSearchByName(); // by name
 
  // enable sorting
  initSortBy();

  // init side bar
  toggleShopSidebar();
};


const getSelectedCategoryFromUrl = () => {
      // get selected category name from a page URL (hash)
      let selectedCategoryName = decodeURI(window.location.hash.substring(1));
      // try to find it in a list of categories
      const selectedCategory =  filterParameters.categoriesCollection.find(category=>category.name === selectedCategoryName);
      // if category not found we return empty id which means 'All'
      return (selectedCategory) ? selectedCategory.id : '';
}

// renders whole products section - list of products and list of categories (works as a filter)
const setupProductCategorySection = () => {
      // callback function that will be invoked when user selects a category. Loads and renders products
      const onCategorySelected = (selectedCategoryId) => {
        filtersApplied.categoryId = selectedCategoryId;
        renderSelectedProducts(filtersApplied);
      }
      // if there are no categories to render - quit
      if (!filterParameters.categoriesCollection) return;
      // adding 'All' category before the render - it will have empty categoryId 
      const categoriesWithAll = [
          { id: '',
            name:'All',
            count:filterParameters.categoriesCollection[0].count,},
          ...filterParameters.categoriesCollection];

      // if there is no category selected then set it to empty which means 'All'
      if (!filtersApplied.categoryId) filtersApplied.categoryId = '';

      // render 'Categories' filter
      setupProductCategories(categoriesWithAll, filtersApplied.categoryId, onCategorySelected);  
}

const setupManufacturerSection = () => {
  const onManufacturerSelected = (selectedManufacturer) => {
     filtersApplied.manufacturer = (selectedManufacturer !== 'All') ? selectedManufacturer : undefined;
     renderSelectedProducts(filtersApplied);
  }
  const manufacturersWithAll = ['All',...filterParameters.manufacturersCollection];

  setupProductManufacturers(manufacturersWithAll, filtersApplied.manufacturer, onManufacturerSelected);  
}

const setupProductsGrid = (filters) => {
  // load and render products
  renderSelectedProducts(filters);
  // initiating pagination buttons
  initProductPaginationBtns(btnContainer, selectedIndex => {
      matchingProducts.index = selectedIndex;
      renderProducts(matchingProducts.pages[matchingProducts.index], productsGridContainer)
  })
}

// this will fetch and render products basing on the filters applied
const renderSelectedProducts = async (filters) => {
  const rawProducts = (await fetchProducts(filters)); 
  const products = rawProducts.data;
  // we need to save loaded products to store so their data will be accesible by the chart
  setupStore(rawProducts);
  
  // slice products into pages
  matchingProducts.pages = paginate(products,productsPerPage);
  matchingProducts.index = 0;

  renderProducts(matchingProducts.pages[matchingProducts.index], productsGridContainer);
  renderPagesButtons(btnContainer, matchingProducts.pages.length, matchingProducts.index);
  renderTotalProductCount(products.length);
  return products;
}

const renderTotalProductCount = (productCount) => {
  totalProductCountContainer.innerHTML = productCount + ' products';
}

const initSearchByName = () =>{
  // each time user types - change filter by name property and re-render products
  initSearch(searchInputElement,text => {filtersApplied.searchProduct = text; renderSelectedProducts(filtersApplied)});
}

const initSortBy = () => {
  const onSortTypeChanged = (e) => {
    filtersApplied.sortType = e.target.value;
    renderSelectedProducts(filtersApplied);
  }

  sortSelectContainer.addEventListener('change',onSortTypeChanged);
}

const initPriceSlider = () => {  
  const sliderOptions = {
    onChange : (min,max) => {
      filtersApplied.priceMin = min;
      filtersApplied.priceMax = max;
      renderSelectedProducts(filtersApplied);
    },
    values : {
      startingMin:  filterParameters.minMaxPrice.minPrice,
      startingMax:  filterParameters.minMaxPrice.maxPrice,
      min:          filterParameters.minMaxPrice.minPrice,
      max:          filterParameters.minMaxPrice.maxPrice, 
    }
  }

  initSlider(sliderContainer,sliderOptions);
}


  export default onShopLoad;
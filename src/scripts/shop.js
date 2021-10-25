import initSlider from "../components/rangeSlider";
import fetchFilterParameters from "../scripts/api/fetchFilterParameters";
import initSearch from "../scripts/filters/searchProducts";
import fetchProducts from "./api/fetchProducts";
import { setupProductCategorySection } from "./filters/productCategories";
import { setupManufacturerSection } from "./filters/productManufacturers";
import { toggleShopSidebar } from "./filters/toggleShopSidebar";
import { renderTotalProductCount } from "./products/renderProducts.js";
import { renderProductsGallery, setupProductsGallery} from "./products/setupProductsGallery";

// global variables for a page state
let filtersApplied = {}; // applied filter values
let filterParameters = {}; // possible values for all filters (list of categories, prices etc)

// bindings to DOM elements 
const btnContainer = document.querySelector(".btn-container");
const sliderContainer = document.querySelector(".shop-sidebar__slider-container");
const sortSelectContainer = document.querySelector(".form-relevance__select");
const totalProductCountContainer = document.querySelector(".shop__header-quantity");
const productsGridContainer = document.querySelector(".products__list");
const searchInputElement = document.querySelector(".form-search__input");
const manufacturerFilterContainer = document.querySelector(".manufacturers-nav");

// Settings - shop gallery params
const shopGridParams = {
  numProductsPerPage: 6,
  productsContainer: productsGridContainer,
  productsBtnsContainer: btnContainer,
  paginatedProducts: {},
};

// main function to render and setup page
const onShopLoad = async () => {
  // load filter params - available values for categories etc
  filterParameters = await fetchFilterParameters(); 
  // set initial filters for products lookup:
  filtersApplied.categoryId = getSelectedCategoryFromUrl(); // get selected category from URL (if any)

  // this will fetch products for the selected category and setup paginated products gallery
  setupShopProductsGrid();

  // render and init all the filters sections
  // by category :
  setupProductCategorySection(
    filterParameters.categoriesCollection, // array of available categories
    filtersApplied.categoryId,
    onCategorySelected // callback 
  ); 
  // by manufacturer:
  setupManufacturerSection(
    manufacturerFilterContainer,
    filterParameters.manufacturersCollection, // array of available manufacturers
    onManufacturerSelected //callback
  ); 
  initPriceSlider(); // by price - slider
  initSearchByName(); // by name

  initSortBy(); // enable sorting
  toggleShopSidebar(); // init side bar
};

const getSelectedCategoryFromUrl = () => {
  // get selected category name from a page URL (hash)
  let selectedCategoryName = decodeURI(window.location.hash.substring(1));
  // try to find it in a list of categories
  const selectedCategory = filterParameters.categoriesCollection.find(
    (category) => category.name === selectedCategoryName
  );
  // if category not found we return empty id which means 'All'
  return selectedCategory ? selectedCategory.id : "";
};

const setupShopProductsGrid = async () => {
  // fetch products that match filters
  const products = await fetchProducts(filtersApplied);
  // setup the page
  setupProductsGallery(products, shopGridParams);
  renderTotalProductCount(totalProductCountContainer, products);
};

// this fetches filtered products and updates components
const updateShopProductsGrid = async () => {
  // fetch products that match filters
  const products = await fetchProducts(filtersApplied);
  // update the page
  renderProductsGallery(products, shopGridParams);
  renderTotalProductCount(totalProductCountContainer, products);
};

// callback function that will be invoked when user selects a category
const onCategorySelected = (selectedCategoryId) => {
  filtersApplied.categoryId = selectedCategoryId;
  updateShopProductsGrid();
};

const onManufacturerSelected = (selectedManufacturer) => {
  filtersApplied.manufacturer =
    selectedManufacturer !== "All" ? selectedManufacturer : "";
  updateShopProductsGrid();
};

const initSearchByName = () => {
  // each time user types - change filter by name property and re-render products
  initSearch(searchInputElement, (text) => {
    filtersApplied.searchProduct = text;
    updateShopProductsGrid();
  });
};

const initSortBy = () => {
  sortSelectContainer.addEventListener("change", (e) => {
    filtersApplied.sortType = e.target.value;
    updateShopProductsGrid();
  });
};

const initPriceSlider = () => {
  const onChange = (min, max) => {
    filtersApplied.priceMin = min;
    filtersApplied.priceMax = max;
    updateShopProductsGrid();
  };

  const sliderValues = {
    startingMin: filterParameters.minMaxPrice.minPrice,
    startingMax: filterParameters.minMaxPrice.maxPrice,
    min: filterParameters.minMaxPrice.minPrice,
    max: filterParameters.minMaxPrice.maxPrice,
  };

  initSlider(sliderContainer, sliderValues, onChange);
};

export default onShopLoad;

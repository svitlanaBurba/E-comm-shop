import initSlider from "../components/rangeSlider";
import fetchFilterParameters from "../scripts/api/fetchFilterParameters";
import initSearch from "../scripts/filters/searchProducts";
import fetchProducts from "./api/fetchProducts";
import { addToCart } from "./cart/setupCart";
import setupProductCategories from "./filters/productCategories";
import setupProductManufacturers from "./filters/productManufacturers";
import { toggleShopSidebar } from "./filters/toggleShopSidebar";
import paginate from "./products/paginate";
import {
  initProductPaginationBtns,
  renderPagesButtons,
} from "./products/paginationButtons";
import { initProducts, renderProducts } from "./products/renderProducts.js";
import { setupStore } from "./store.js";

let filtersApplied = {};
let filterParameters = {};
let matchingProducts = {};

const productsPerPage = 6;

const btnContainer = document.querySelector(".btn-container");
const sliderContainer = document.querySelector(
  ".shop-sidebar__slider-container"
);
const sortSelectContainer = document.querySelector(".form-relevance__select");
const totalProductCountContainer = document.querySelector(
  ".shop__header-quantity"
);
const productsGridContainer = document.querySelector(".products__list");
const searchInputElement = document.querySelector(".form-search__input");
const manufacturerFilterContainer =
  document.querySelector(".manufacturers-nav");

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
  const selectedCategory = filterParameters.categoriesCollection.find(
    (category) => category.name === selectedCategoryName
  );
  // if category not found we return empty id which means 'All'
  return selectedCategory ? selectedCategory.id : "";
};

// renders whole products section - list of products and list of categories (works as a filter)
const setupProductCategorySection = () => {
  // callback function that will be invoked when user selects a category. Loads and renders products
  const onCategorySelected = (selectedCategoryId) => {
    filtersApplied.categoryId = selectedCategoryId;
    renderSelectedProducts(filtersApplied);
  };
  // if there are no categories to render - quit
  if (!filterParameters.categoriesCollection) return;
  // adding 'All' category before the render - it will have empty categoryId
  const categoriesWithAll = [
    {
      id: "",
      name: "All",
      count: filterParameters.categoriesCollection[0].count,
    },
    ...filterParameters.categoriesCollection.filter(
      (category) => category.count > 0
    ),
  ];

  // if there is no category selected then set it to empty which means 'All'
  if (!filtersApplied.categoryId) filtersApplied.categoryId = "";

  // render 'Categories' filter
  setupProductCategories(
    categoriesWithAll,
    filtersApplied.categoryId,
    onCategorySelected
  );
};

const setupManufacturerSection = () => {
  const onManufacturerSelected = (selectedManufacturer) => {
    filtersApplied.manufacturer =
      selectedManufacturer !== "All" ? selectedManufacturer : undefined;
    renderSelectedProducts(filtersApplied);
  };

  //
  const manufacturersWithAll = [
    {
      id: "",
      name: "All",
      count: filterParameters.manufacturersCollection.reduce(
        (a, v) => a + v.count,
        0
      ),
      isActive: true,
    },
    ...filterParameters.manufacturersCollection,
  ];

  setupProductManufacturers(
    manufacturerFilterContainer,
    manufacturersWithAll,
    onManufacturerSelected
  );
};

const setupProductsGrid = (filters) => {
  // load and render products
  renderSelectedProducts(filters);
  // Add listeners - Open Cart when button "cart" on the product is clicked
  initProducts(productsGridContainer, addToCart);
  // initiating pagination buttons - add listeners
  // when pagination button is clicked - change active index and render proper page
  initProductPaginationBtns(btnContainer, (selectedIndex) => {
    matchingProducts.index = selectedIndex;
    renderProducts(
      productsGridContainer,
      matchingProducts.pages[matchingProducts.index]
    );
  });
};

// this will fetch and render products basing on the filters applied
const renderSelectedProducts = async (filters) => {
  const rawProducts = await fetchProducts(filters);
  const products = rawProducts.data;
  // we need to save loaded products to store so their data will be accesible by the chart
  setupStore(rawProducts);

  // slice products into pages
  matchingProducts.pages = paginate(products, productsPerPage);
  matchingProducts.index = 0;

  renderProducts(
    productsGridContainer,
    matchingProducts.pages[matchingProducts.index]
  );
  renderPagesButtons(
    btnContainer,
    matchingProducts.pages.length,
    matchingProducts.index
  );
  renderTotalProductCount(products.length);
  return products;
};

const renderTotalProductCount = (productCount) => {
  totalProductCountContainer.innerHTML = productCount + " products";
};

const initSearchByName = () => {
  // each time user types - change filter by name property and re-render products
  initSearch(searchInputElement, (text) => {
    filtersApplied.searchProduct = text;
    renderSelectedProducts(filtersApplied);
  });
};

const initSortBy = () => {
  const onSortTypeChanged = (e) => {
    filtersApplied.sortType = e.target.value;
    renderSelectedProducts(filtersApplied);
  };

  sortSelectContainer.addEventListener("change", onSortTypeChanged);
};

const initPriceSlider = () => {
  const onChange = (min, max) => {
    filtersApplied.priceMin = min;
    filtersApplied.priceMax = max;
    renderSelectedProducts(filtersApplied);
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

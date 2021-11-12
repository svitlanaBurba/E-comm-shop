import * as $ from "jquery";
import "slick-carousel";
import singleProductTemplate from "./../templates/singleProductTemplate.hbs";
import fetchSimilarProducts from "./api/fetchSimilarProducts";
import { addToCart, setupCart } from "./cart/setupCart";
import { setupProductsGallery } from "./products/setupProductsGallery";
import { setupLeaveReview } from "./reviews/setupLeaveReview";
import { setupReviews } from "./reviews/setupReviews";
import { getSingleProductData } from "./singleProduct/getSingleProductData";
import {
  addProductToViewedList,
  getViewedProducts,
} from "./singleProduct/viewedProducts";

const similarProductsParams = {
  numProductsPerPage: 3,
  productsContainer: document.querySelector(".products__list.random"),
  productsBtnsContainer: document.querySelector(".btn-container.random"),
  paginatedProducts: {},
};

const viewedProductsParams = {
  numProductsPerPage: 3,
  productsContainer: document.querySelector(".products__list.viewed"),
  productsBtnsContainer: document.querySelector(".btn-container.viewed"),
  paginatedProducts: {},
};

const onProductLoad = async () => {
  //parsing productId from the querystring
  const queryString = window.location.search;
  const productId = parseInt(new URLSearchParams(queryString).get("id"));

  // fetch and render single product details
  let productData = await getSingleProductData(productId);
  setupProductDetailsSection(productData);
  initMainPhotoSlider();

  // Similar products gallery
  const similarProducts = await fetchSimilarProducts(9); //  fetch 9 (or less) similar products
  setupProductsGallery(similarProducts, similarProductsParams);
  // Viewed products gallery
  const viewedProducts = await getViewedProducts(9); //  fetch 9 (or less) viewed products
  setupProductsGallery(viewedProducts, viewedProductsParams);

  // Reviews sections
  setupReviews(productId);
  setupLeaveReview(productId, setupReviews);

  // add product to the list of the previously viewed
  addProductToViewedList(productData);

  setupCart();
};

const setupProductDetailsSection = (product) => {
  const rating = Math.floor(product.avgRating);
  // preprare rating for rendering: array for stars
  product.ratingArr = [...Array(5).keys()].map((e) => e + 1 <= rating);
  // format rating value
  product.avgRating =
    product.avgRating !== 0
      ? (product.avgRating = product.avgRating.toFixed(2))
      : (product.avgRating = "No reviews yet");
  
  product.stockIsLow = product.stock > 0 && product.stock < 5;

  document.querySelector(".product-container").innerHTML =
    singleProductTemplate(product);

  initAddToCartBlock(product);
  //rendering product title in the hero
  document.querySelector(".hero-product-title").textContent = product.title;
};

const initAddToCartBlock = (product) => {
  //increase and decrease item amount with card "-" and "+" buttons
  const itemAmount = document.querySelector(".product-page__item-amount");

  document.querySelector(".product-page__increase-btn").onclick = () =>
  {
    const curAmount = +itemAmount.textContent;
    const stock = itemAmount.dataset.stock;
    itemAmount.textContent = Math.min(curAmount + 1, stock);
  };

  document.querySelector(".product-page__decrease-btn").onclick = () =>
    (itemAmount.textContent = `${Math.max(0, +itemAmount.textContent - 1)}`);

  document.querySelector(".order-btn").addEventListener("click", () => {
    addToCart(product.id.toString(), product, Number(itemAmount.textContent));
  });
};

// initializing images gallery - slider for mini photos, click sets main photo
const initMainPhotoSlider = () => {
  const mainPhoto = document.querySelector(".product-page__main-photo-img");
  const miniPhotoContainer = document.querySelector(".product-page__mini-photos-container");

  miniPhotoContainer.onclick = (e) => {
    if (e.target.classList.contains("product-page__mini-photo-img")) {
      mainPhoto.src = e.target.src;
    }
  };

  // init slick carousel for mini photos
  initMiniPhotoSlider();
};

const initMiniPhotoSlider = () => {
  $(".product-page__mini-photos-container").slick({
    dots: false,
    vertical: true,
    slidesToShow: 4,
    verticalSwiping: true,
    infinite: true,
    arrows: false,
  });
};

export default onProductLoad;

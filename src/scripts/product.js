import * as $ from "jquery";
import "slick-carousel";
import singleProductTemplate from "./../templates/singleProductTemplate.hbs";
import fetchSimilarProducts from "./api/fetchSimilarProducts";
import { addToCart } from "./cart/setupCart";
import setupProductsGallery from "./products/setupProductsGallery";
import { setupLeaveReview } from "./reviews/setupLeaveReview";
import { setupReviews } from "./reviews/setupReviews";
import { getSingleProductData } from "./singleProduct/getSingleProductData";
import {
  addProductToViewedList,
  getViewedProducts,
} from "./singleProduct/viewedProducts";

const similarProductsParams = {
  numProducts: 9,
  numProductsPerPage: 3,
  productsContainer: document.querySelector(".products__list.random"),
  productsBtnsContainer: document.querySelector(".btn-container.random"),
  paginatedProducts: {},
};

const viewedProductsParams = {
  numProducts: 9,
  numProductsPerPage: 3,
  productsContainer: document.querySelector(".products__list.viewed"),
  productsBtnsContainer: document.querySelector(".btn-container.viewed"),
  paginatedProducts: {},
};

const onProductLoad = async () => {
  //parsing productId from the querystring
  const queryString = window.location.search;
  const productId = parseInt(new URLSearchParams(queryString).get("id"));

  let productData = await getSingleProductData(productId);

  //rendering single product
  renderSingleProduct(productData);
  addProductToViewedList(productData, 10);

  const similarProducts = await fetchSimilarProducts(
    productId,
    similarProductsParams.numProducts
  );
  setupProductsGallery(similarProducts, similarProductsParams);
  setupProductsGallery(getViewedProducts(), viewedProductsParams);

  setupReviews(productId);
  setupLeaveReview(productId, setupReviews);

  initMainPhotoSlider();
};

const renderSingleProduct = (product) => {
  const rating = Math.floor(product.avgRating);
  // preprare rating for rendering: array for stars
  product.ratingArr = [...Array(5).keys()].map((e) => e + 1 <= rating);
  // format rating value
  product.avgRating =
    product.avgRating !== 0
      ? (product.avgRating = product.avgRating.toFixed(2))
      : (product.avgRating = "No reviews yet");

  document.querySelector(".product-container").innerHTML =
    singleProductTemplate(product);
  
  initAddToCartBlock(product);

        //rendering product title in the hero
        document.querySelector(".hero-product-title").textContent = product.title;
};


const initAddToCartBlock = (product) => {

    //increase and decrease item amount with card "-" and "+" buttons
    const itemAmount = document.querySelector(".product-page__item-amount");
    document
      .querySelector(".product-page__increase-btn")
      .addEventListener(
        "click",
        () => (itemAmount.textContent = `${+itemAmount.textContent + 1}`)
      );
    document
      .querySelector(".product-page__decrease-btn")
      .addEventListener(
        "click",
        () =>
          (itemAmount.textContent = `${Math.max(0, +itemAmount.textContent - 1)}`)
      );
  
    document.querySelector(".order-btn").addEventListener("click", () => {
      addToCart(product.id.toString(), product, Number(itemAmount.textContent));
    });
}

//Changing main image
const initMainPhotoSlider = () => {
  const miniPhotos = [
    ...document.querySelectorAll(".product-page__mini-photo-img"),
  ];
  const mainPhoto = document.querySelector(".product-page__main-photo-img");

  const showMainPhoto = (miniPhoto) => {
    mainPhoto.src = miniPhoto.src;
  };

  miniPhotos.forEach((miniPhoto) =>
    miniPhoto.addEventListener("click", () => {
      showMainPhoto(miniPhoto);
    })
  );

  initMiniPhotoSlider();
};

const initMiniPhotoSlider = () => {
  $(".product-page__mini-photos-container").slick({
    dots: false,
    vertical: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    verticalSwiping: true,
    infinite: true,
    arrows: false,
  });
};

export default onProductLoad;
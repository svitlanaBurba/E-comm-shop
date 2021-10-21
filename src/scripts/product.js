import "slick-carousel";
import * as $ from 'jquery';
import singleProductReviewTemplate from "./../templates/singleProductReviewTemplate.hbs";
import singleProductTemplate from "./../templates/singleProductTemplate.hbs";
import fetchProductById from "./api/fetchProductById";
import fetchProductByUPC from "./api/fetchProductByUPC";
import fetchSimilarProducts from "./api/fetchSimilarProducts";
import { addToCart } from "./cart/setupCart";
import setupReviewFormSubmit from "./formHandlers/handleReviewFormSubmit";
import paginate from "./products/paginate";
import {
  initProductPaginationBtns,
  renderPagesButtons,
} from "./products/paginationButtons";
import { initProducts, renderProducts } from "./products/renderProducts";
import { formatPrice, getStorageItem, setStorageItem } from "./utils";

/* const numSimilarProducts = 9;
const numSimlarProductsPerPage = 3;
const similarProductsContainer = document.querySelector('.products__list');
const similarProductsBtnsContainer = document.querySelector('.btn-container');
const paginatedSimilarProducts = {};
 */
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

const numViewedProductsToStore = 10;

const onProductLoad = async () => {
  //parsing out the parameters from the querystring
  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const productId = parseInt(params.get("id"));

  const productData = await fetchProductById(productId);
  console.log(productData);

  addProductToViewedList(productData);

  const productDataByUPC = await fetchProductByUPC(productData.upc);
  console.log(productDataByUPC.items[0]);

  //adding to product object calculated prorerties
  productData.discountedPrice = calculateDiscount(productData);
  productData.avgRating = getProductAvgRating(productId);

  //adding to product object prorerties from additional API
  productData.title = productDataByUPC.items[0].title;
  productData.longDescription = productDataByUPC.items[0].description;
  productData.color = productDataByUPC.items[0].color;
  productData.dimension = productDataByUPC.items[0].dimension;
  productData.images = productDataByUPC.items[0].images;

  //rendering single product
  renderProduct(productData);

  const similarProducts = await fetchSimilarProducts(
    productId,
    similarProductsParams.numProducts
  );
  setupProductsGallery(similarProducts, similarProductsParams);

  setupProductsGallery(getStorageItem("viewedProducts"), viewedProductsParams);


  setupReviews(productId);
  setupReviewFormSubmit(() => setupReviews(productId));

  const ratingContainer = document.querySelector(".rating.form");
  executeRating(ratingContainer);

  mainPhotoSlider();
  addSliders();
};

const setupProductsGallery = (
  products,
  {
    paginatedProducts,
    numProductsPerPage,
    productsContainer,
    productsBtnsContainer,
  }
) => {
  // renders products and pagination buttons
  // slice products into pages
  paginatedProducts.pages = paginate(products, numProductsPerPage);
  paginatedProducts.index = 0;

  renderProducts(
    productsContainer,
    paginatedProducts.pages[paginatedProducts.index]
  );

  renderPagesButtons(
    productsBtnsContainer,
    paginatedProducts.pages.length,
    paginatedProducts.index
  );

  // adds 'add to cart' listener to similar products cards
  initProducts(productsContainer, (selectedProductId) => {
    const selectedProduct = products.find(
      (product) => product.id === Number(selectedProductId)
    );
    console.log(selectedProductId, selectedProduct, products);
    addToCart(selectedProductId, selectedProduct);
  });

  // add listener to pagination buttons
  initProductPaginationBtns(productsBtnsContainer, (selectedIndex) => {
    paginatedProducts.index = selectedIndex;
    renderProducts(
      productsContainer,
      paginatedProducts.pages[paginatedProducts.index]
    );
  });
};

const setupReviews = (productId) => {
  const reviewsContainer = document.querySelector(".reviews__list");
  const reviewsBtnLoadMore = document.querySelector(".reviews__btn");
  reviewsContainer.innerHTML = "";

  const reviews = getStorageItem("reviews").filter(
    (review) => review.productId === productId
  );

  // preparing an array for the star rating - 5 boolean elements:
  // 1 per star, true displays filled star
  reviews.forEach((review) => {
    review.ratingArr = [...Array(5).keys()].map(
      (e) => e + 1 <= review.reviewNumber
    );
  });

  let reviewsPerLoadNumber = 3;
  const paginatedReviews = paginate(reviews, reviewsPerLoadNumber);
  let currentReviewsPage = 0;

  const loadMoreReviews = () => {
    reviewsContainer.insertAdjacentHTML(
      "beforeend",
      singleProductReviewTemplate(paginatedReviews[currentReviewsPage])
    );
    currentReviewsPage += 1;
    
    // hide/display 'Load More' button
    if (currentReviewsPage >= paginatedReviews.length) {
      reviewsBtnLoadMore.classList.add("visually-hidden");
    } else {
      reviewsBtnLoadMore.classList.remove("visually-hidden");
    }

  };

  loadMoreReviews();
  reviewsBtnLoadMore.addEventListener("click", loadMoreReviews);
};

const getProductAvgRating = (productId) => {
  const reviews = getStorageItem("reviews").filter(
    (review) =>
      review.productId === productId && Number(review.reviewNumber) > 0
  );
  const avgRating =
    reviews.length === 0
      ? 0
      : reviews.reduce((a, review) => a + parseInt(review.reviewNumber), 0) /
        reviews.length;

  return avgRating;
};

const calculateDiscount = (product) => {
  const dicsountRate = product.price > 50 ? 0.2 : 0.1;
  return formatPrice(product.price * (1 - dicsountRate));
};

const renderProduct = (product) => {
  const rating = Math.floor(product.avgRating);

  // preprar rating for rendering:
  // array for stars
  product.ratingArr = [...Array(5).keys()].map((e) => e + 1 <= rating);
  // rating value
  if (product.avgRating !== 0) {
    product.avgRating = product.avgRating.toFixed(2);
  } else {
    product.avgRating = "No reviews yet";
  }

  document.querySelector(".product-container").innerHTML =
    singleProductTemplate(product);

  //rendering product title in the hero
  document.querySelector(".hero-product-title").textContent = product.title;

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
};

// //STARS

const executeRating = (ratingContainer) => {
  const starClassActive = "rating__star fas fa-star form";
  const starClassInactive = "rating__star far fa-star form";
  const reviewNumber = document.querySelector(".review-form__number");

  const stars = [
    ...ratingContainer.getElementsByClassName("rating__star form"),
  ];

  let i;
  stars.forEach((star) => {
    star.onclick = (e) => {
      i = stars.indexOf(star);

      if (star.className.indexOf(starClassInactive) !== -1) {
        for (i; i >= 0; --i) stars[i].className = starClassActive;
      } else {
        for (i; i < stars.length; ++i) stars[i].className = starClassInactive;
      }
      reviewNumber.value = e.target.dataset.index;
    };
  });
};

const addProductToViewedList = (productToAdd) => {
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

//Changing main image
const mainPhotoSlider = () => {
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
};

const addSliders = () => {

   $(".product-page__mini-photos-container").slick({
    dots: false,
    vertical: true,
    slidesToShow: 4,
    slidesToScroll: 2,
    verticalSwiping: true,
    infinite: true,
    arrows:false,
   });
};

export default onProductLoad;

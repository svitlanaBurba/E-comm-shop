import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
import 'slick-carousel';

import CountdownTimer from './timer';

import './cart/toggleCart';
import './cart/setupCart';

import fetchProducts from './api/fetchProducts';
import fetchCategoryImages from './api/fetchCategoryImages';
import fetchCategoriesWithCount from './api/fetchCategories';

import setupCategories from './collections/setupCategories'
import {initProducts, renderProducts} from './products/renderProducts.js';
import setupProductCategories from './filters/productCategories';
import renderCollections from './collections/renderCollections';
import { addToCart } from './cart/setupCart';


 const onMainLoad = async () => {
  await setupProductsSection();
  setupTimer();
  addSliders();
};


const setupProductsSection = async () => {

      const collectionImages = await fetchCategoryImages();
      const categoriesWithCount = await fetchCategoriesWithCount();
      const categories = setupCategories(categoriesWithCount,collectionImages.hits);

      let defaultCategoryId = categories.find(category=>category.name="All").id;

      await renderSelectedPopularProducts(defaultCategoryId);
      setupProductCategories(categories, defaultCategoryId, renderSelectedPopularProducts); 
      renderCollections(categories, document.querySelector('.categories-galery2'))

}

const  renderSelectedPopularProducts = async (selectedCategoryId) => {

  // we don't have any 'popular' flag, so let's choose cheap products
const products = (await fetchProducts({categoryId:selectedCategoryId})).data;  

  let popularProducts = products.filter(product=>product.price<16);

  renderProducts(document.querySelector('.products__list'), popularProducts);
  initProducts(document.querySelector('.products__list'),addToCart);
}

const setupTimer = () => {
    const timer = new CountdownTimer({
      selector: '#timer-main',
      targetDate: new Date('Dec 31, 2021')
    });
    timer.start();
}

const addSliders = () => {

  $(document).ready(function () {
    $('.testimonials__wrapper').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      swipe: true,
      nextArrow: '.testimonials__next',
      prevArrow: '.testimonials__prev',
      //
      dots: true,
      appendDots: '.testimonials__dots',
      customPaging: function (slick, index) {
        return `<span class="slick-icon">0${index + 1}.<span/>`;
      }
    });
  });

  $(document).ready(function () {
    $('.promo__container').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      arrows: false,
      swipe: false,
      fade: true
    });

    $('.categories-galery2').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 4,
      // arrows: true,
      // swipe: true,
      dots: true,
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 540,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });

    $('.hero__container').slick({
      infinite: true,
      speed: 300,
      slidesToShow: 1,
      //
      dots: true,
      appendDots: '.hero__dots',
      customPaging: function (slick, index) {
        return `<span class="slick-icon">0${index + 1}. <span/>`;
      },
      //
      arrows: true,
      nextArrow: '.hero__btn__next',
      prevArrow: '.hero__btn__prev'
    });

    $('.hero__container').on(
      'afterChange',
      function (event, slick, currentSlide) {
        $('.promo__container').slick('slickGoTo', currentSlide);
      }
    );
  });
};

export default onMainLoad;

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
import renderProducts from './products/renderProducts.js';
import setupProductCategories from './filters/productCategories';
import renderCollections from './collections/renderCollections';


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


      // const pagination = {page:1, perPage:3};
      await renderSelectedPopularProducts(defaultCategoryId);
      setupProductCategories(categories, renderSelectedPopularProducts, defaultCategoryId); 
      renderCollections(categories, document.querySelector('.categories-galery2'))

}

const  renderSelectedPopularProducts = async (selectedCategoryId) => {
  // we don't have any 'popular' flag, so let's choose cheap products
  const products = (await fetchProducts(selectedCategoryId)).data;   
  let popularProducts = products.filter(product=>product.price<16);
  renderProducts(popularProducts, document.querySelector('.products__list'));
}

const setupTimer = () => {
    const timer = new CountdownTimer({
      selector: '#timer-main',
      targetDate: new Date('Oct 05, 2021')
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
      arrows: true,
      swipe: true,

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

import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
import 'slick-carousel';

import CountdownTimer from './timer';

import './cart/toggleCart';
import './cart/setupCart';

import fetchProducts from './products/fetchProducts';
import fetchCollectionImages from './collections/fetchCollectionImages';

import {setupStore, store, categories, setupCategories} from './store.js';
import renderProducts from './products/renderProducts.js';
import setupProductCategories from './filters/productCategories';
import renderCollections from './collections/renderCollections';


 const onMainLoad = async () => {
  await setupProductsSection();
  setupTimer();
  addSliders();
};

const setupProductsSection = async () => {
      const products = await fetchProducts();
      const collectionImages = await fetchCollectionImages();
      console.log(collectionImages);

      if (products && collectionImages.hits) {
        // add products to the store
        setupStore(products);
        setupCategories(store,collectionImages.hits);

        renderSelectedPopularProducts("All");
        // render categories buttons list
   
        setupProductCategories(categories, renderSelectedPopularProducts, "All");  
      
        renderCollections(categories, document.querySelector('.categories-galery2'))
      }
}

const renderSelectedPopularProducts = selectedCategory => {
  // we don't have any 'popular' flag, so let's choose cheap products
  const popularProducts = store.filter(product => product.price < 16);
  renderProducts(popularProducts, document.querySelector('.products__list'), selectedCategory);
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

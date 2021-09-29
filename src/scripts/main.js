import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
import 'slick-carousel';

const onMainLoad = () => {
  $(document).ready(function () {
    //addSliders();
  });
};

const addSliders = () => {
  console.log('Adding sliders');
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
      function (event, slick, currentSlide, nextSlide) {
        $('.promo__container').slick('slickGoTo', currentSlide);
      }
    );
  });
};

export default onMainLoad;

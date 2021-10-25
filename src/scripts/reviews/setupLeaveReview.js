import setupReviewFormSubmit from '../formHandlers/handleReviewFormSubmit';
import leaveReviewTemplate from './../../templates/leaveReviewTemplate.hbs'

export const setupLeaveReview = (productId, onReviewAdded) => {
    const container = document.querySelector('.product-page__reviews-right');

    container.innerHTML = leaveReviewTemplate({id:productId});

    const ratingContainer = document.querySelector(".rating.form");
    initRatingSelector(ratingContainer);

    setupReviewFormSubmit(() => onReviewAdded(productId));
}


const initRatingSelector = (ratingContainer) => {
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
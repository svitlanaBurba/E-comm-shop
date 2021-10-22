import singleProductReviewTemplate from "./../../templates/singleProductReviewTemplate.hbs";
import paginate from "./../products/paginate";
import { getStorageItem } from "./../utils";

export const setupReviews = (productId) => {
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
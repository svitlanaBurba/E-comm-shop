import { getElement,getStorageItem,setStorageItem } from "../utils"


const handleReviewFormSubmit = e => {
    e.preventDefault();


    const formData = new FormData(e.target);

    //transforming key-value pairs into an object
    const reviewData = Object.fromEntries(formData.entries());

    const reviews = getStorageItem('reviews');
    reviewData.productId = parseInt(e.target.dataset.id);
    reviewData.reviewDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
console.log(reviewData.reviewDate);

    reviews.unshift(reviewData);
    const reviewsStorage = setStorageItem('reviews', reviews);
  
    return reviewsStorage;
}

const setupReviewFormSubmit = (afterReviewAddedFunc) => {
    const reviewForm = getElement('#review-form');
    reviewForm.addEventListener("submit", (e)=>{handleReviewFormSubmit(e);afterReviewAddedFunc();});

}

export default setupReviewFormSubmit;
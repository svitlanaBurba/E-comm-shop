import { getStorageItem } from "../utils";

export const getProductAvgRating = (productId) => {
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
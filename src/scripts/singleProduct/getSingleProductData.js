import fetchProductById from "../api/fetchProductById";
import fetchProductByUPC from "../api/fetchProductByUPC";
// import { formatPrice } from "../utils";
import { getProductAvgRating } from "./getProductAvgRating";

export const getSingleProductData = async (productId) => {
    const productData = await fetchProductById(productId);
  
    const productDataByUPC = await fetchProductByUPC(productData.upc);
  
    //adding to product object calculated prorerties
    productData.avgRating = getProductAvgRating(productId);
  
    //adding to product object prorerties from additional API
    productData.title = productDataByUPC.items[0].title;
    productData.longDescription = productDataByUPC.items[0].description;
    productData.color = productDataByUPC.items[0].color;
    productData.dimension = productDataByUPC.items[0].dimension;
    productData.images = productDataByUPC.items[0].images;

    return productData;
  }
  
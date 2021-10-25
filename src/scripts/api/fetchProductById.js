import { baseURL} from "./configURLs";
import {calculateProductDiscountPrice, myFetch} from "./utils";


const fetchProductById = async (productId) => {
    const urlProductById = `${baseURL}/products/${productId}`;
    return myFetch(urlProductById,transformRawProductData);
  };  

const transformRawProductData = (product) => {
    calculateProductDiscountPrice(product);
    return product;
}
  
  
  export default fetchProductById;
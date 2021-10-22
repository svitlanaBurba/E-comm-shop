import myFetch from "./utils";
import { baseURL} from "./configURLs";



const fetchProductByUPC = async (productUPC) => {
    const urlProductByUPC = `${baseURL}/productDetails?upc=${productUPC}`;
    // const urlProductByUPC = `https://api.upcitemdb.com/prod/trial/lookup?upc=${productUPC}`;
    return myFetch(urlProductByUPC);
  };
  
  
  export default fetchProductByUPC;
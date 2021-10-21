import { baseURL} from "./configURLs";
import myFetch from "./utils";


const fetchProductById = async (productId) => {
    const urlProductById = `${baseURL}/products/${productId}`;
    return myFetch(urlProductById);
  };
  
  
  export default fetchProductById;
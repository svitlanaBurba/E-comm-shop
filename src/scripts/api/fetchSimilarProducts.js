import { baseURL, defaultCategory } from "./configURLs";
import {myFetch} from "./utils";

const urlProducts = `${baseURL}/products?`;

const fetchSimilarProducts = async (productId, numProducts) => {

  const url = `${urlProducts}category.id=${defaultCategory}&$limit=60000`
  return myFetch(url).then(products => {
        const rndIndex = Math.floor(Math.random()*(products.data.length-numProducts));
        return products.data.slice(rndIndex,rndIndex+numProducts);
  });
};


export default fetchSimilarProducts;

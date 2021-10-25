import { baseURL } from './configURLs';
import { calculateProductOldPrice, myFetch } from './utils';

const fetchProductById = async productId => {
  const urlProductById = `${baseURL}/products/${productId}`;
  return myFetch(urlProductById, transformRawProductData);
};

const transformRawProductData = product => {
  calculateProductOldPrice(product);
  return product;
};

export default fetchProductById;

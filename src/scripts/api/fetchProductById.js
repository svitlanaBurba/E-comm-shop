import { baseURL } from './configURLs';
import { addProductAdditionalProperties, myFetch } from './utils';

const fetchProductById = async productId => {
  const urlProductById = `${baseURL}/products/${productId}`;
  return myFetch(urlProductById, transformRawProductData);
};

const transformRawProductData = product => {
  addProductAdditionalProperties(product);
  return product;
};

export default fetchProductById;

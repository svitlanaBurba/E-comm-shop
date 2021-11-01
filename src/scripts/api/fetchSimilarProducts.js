import { baseURL, defaultCategory } from "./configURLs";
import {addProductAdditionalProperties, myFetch} from "./utils";

const urlProducts = `${baseURL}/products?`;

const fetchSimilarProducts = async (numProductsToLoad) => {
  // our backend does not have any 'similarity' lookup etc
  // so let's just pick numProductsToLoad products in a row
  const urlNumProducts = `${urlProducts}category.id=${defaultCategory}&$limit=0`;
  const numProductsTotal = (await myFetch(urlNumProducts)).total;

  // random number of products to skip before we will get our numProductsToLoad products
  const randIndex = Math.floor(Math.random()*(numProductsTotal-numProductsToLoad));

  // now we fetch numProductsToLoad starting from randIndex
  const url = `${urlProducts}category.id=${defaultCategory}&$skip=${randIndex}&$limit=${numProductsToLoad}`
  return myFetch(url,transformRawProductsData);
};

// this will add oldPrice property to each product
const transformRawProductsData = (rawProductsData) => {
  if (!rawProductsData || !rawProductsData.data) return [];
  rawProductsData.data;

  rawProductsData.data.forEach(product => { 
    addProductAdditionalProperties(product);  
  });

  return rawProductsData.data;
}

export default fetchSimilarProducts;

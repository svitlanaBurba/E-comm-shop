import { baseURL, defaultCategory } from "./configURLs";
import {addProductAdditionalProperties, myFetch} from "./utils";
const urlProducts = `${baseURL}/products?`;

const fetchProducts = async ({categoryId,searchProduct,manufacturer, priceMin, priceMax, sortType}) => {
  if (!categoryId) {categoryId = defaultCategory} 
  if (!searchProduct) {searchProduct = ''} 
  if (!manufacturer) {manufacturer = ''} else {manufacturer=manufacturer.replace("&","*")}
  
  let priceMinClause = (!priceMin) ?  '' : `&price[$gt]=${priceMin}`;
  let priceMaxClause = (!priceMax) ?  '' : `&price[$lt]=${priceMax}`;

  let sortClause = '';
  if (sortType === 'priceLowToHigh') sortClause = '&$sort[price]=1';
  if (sortType === 'priceHighToLow') sortClause = '&$sort[price]=-1';

  const url = `${urlProducts}category.id=${categoryId}&$limit=60000&name[$like]=*${searchProduct}*&manufacturer[$like]=*${manufacturer}*${priceMinClause}${priceMaxClause}${sortClause}`
  return myFetch(url,transformRawProductsData);
};

const transformRawProductsData = (rawProductsData) => {
  if (!rawProductsData || !rawProductsData.data) return [];
  rawProductsData.data;

  // addinging additional product properties if needed
  rawProductsData.data.forEach(product => { 
    addProductAdditionalProperties(product);
  });

  return rawProductsData.data;
}


export default fetchProducts;

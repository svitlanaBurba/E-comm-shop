import { baseURL, defaultCategory } from "./configURLs";
import myFetch from "./utils";

const urlProducts = `${baseURL}/products?`;

const fetchProducts = async ({categoryId,searchProduct,manufacturer, priceMin, priceMax, sortType}) => {
  if (!categoryId) {categoryId = defaultCategory} 
  if (!searchProduct) {searchProduct = ''} 
  if (!manufacturer) {manufacturer = ''} 
  
  let priceMinClause = (!priceMin) ?  '' : `&price[$gt]=${priceMin}`;
  let priceMaxClause = (!priceMax) ?  '' : `&price[$lt]=${priceMax}`;

  let sortClause = '';
  if (sortType === 'priceLowToHigh') sortClause = '&$sort[price]=1';
  if (sortType === 'priceHighToLow') sortClause = '&$sort[price]=-1';

  const url = `${urlProducts}category.id=${categoryId}&$limit=60000&name[$like]=*${searchProduct}*&manufacturer[$like]=*${manufacturer}*${priceMinClause}${priceMaxClause}${sortClause}`

  return myFetch(url);
};


export default fetchProducts;

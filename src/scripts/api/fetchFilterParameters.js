import myFetch from "./utils";
import fetchCategoriesWithCount from "./fetchCategories";
import { baseURL, defaultCategory } from "./configURLs";

const urlFilterParameters = `${baseURL}/products?category.id=${defaultCategory}&$limit=10000&$select[]=price&$select[]=manufacturer`;

const fetchFilterParameters = async () => {
    // this queries for manufacturers and prices
    let params = myFetch(urlFilterParameters,transformFilterParameters);
    // this queries for categories 
    let categories = fetchCategoriesWithCount();

    // when both fetches are resolved - combine them and return
    return Promise.all([params,categories]).then(res=>({...res[0],categoriesCollection:res[1]}))
}

// transormer function to process raw data for manufacturers and prices
const transformFilterParameters = (rawData) => {
    const manufacturersCollection = [... new Set(rawData.data.map(el => el.manufacturer))];
    const priceCollection = rawData.data.map(el => el.price);
    const minMaxPrice = {minPrice: Math.min(...priceCollection), maxPrice: Math.max(...priceCollection)};
    return {manufacturersCollection, minMaxPrice}};

export default fetchFilterParameters;
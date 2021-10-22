import {myFetch} from "./utils";
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
    //const manufacturersCollection = [... new Set(rawData.data.map(el => el.manufacturer))];

    const manufacturersCollection = rawData.data.sort((a,b) => (a.manufacturer>b.manufacturer) ? -1 : 1).reduce((prev,curr,i, arr)=>{
        let result = prev;
        if (i===0 || arr[i-1].manufacturer !== arr[i].manufacturer) {
            result.push({
                id: curr.manufacturer,
                name: curr.manufacturer,
                count: 1
            });
        } else {
            result[result.length-1].count++;
        }

        return result;
    },[]);


    const priceCollection = rawData.data.map(el => el.price);
    const minMaxPrice = {minPrice: Math.min(...priceCollection), maxPrice: Math.max(...priceCollection)};
    return {manufacturersCollection, minMaxPrice}};

export default fetchFilterParameters;
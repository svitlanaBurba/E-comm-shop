import { baseURL,defaultCategory } from "./configURLs";
import {myFetch} from "./utils";

const urlCategories = `${baseURL}/categories/${defaultCategory}`;
const urlCategoriesCount = `${baseURL}/products?`;

const fetchCategoriesWithCount = async () => {
  let categories = await fetchCategories();
  let promises = [];

  if (categories) {
    promises = categories.map(category=>
      fetchCategoryCount(category.id).then(categoryCount=>({...category,count:categoryCount.total}))
    );
  }
  return Promise.all(promises);
}

const fetchCategories = async () => myFetch(urlCategories,transformRawCategories)

const transformRawCategories = (rawCategories) => {
  let categories = [{id: rawCategories.id, name: rawCategories.name}];

  rawCategories.subCategories.forEach(subCategory=>
    categories.push({id: subCategory.id, name: subCategory.name})
  )
  return categories;
}

const fetchCategoryCount = async (categoryId) => {
  const url = `${urlCategoriesCount}category.id=${categoryId}&$limit=0`
  return myFetch(url);
};

  
export default fetchCategoriesWithCount;
  

import { categoryImgURL } from "./configURLs";
import myFetch from "./utils";

const fetchCategoryImages = async () =>  myFetch(categoryImgURL);

export default fetchCategoryImages;
  

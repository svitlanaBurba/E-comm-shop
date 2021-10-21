import myFetch from "./utils";




const fetchProductByUPC = async (productUPC) => {
    const urlProductByUPC = `http://localhost:3030/productDetails?upc=${productUPC}`;
    // const urlProductByUPC = `https://api.upcitemdb.com/prod/trial/lookup?upc=${productUPC}`;
    return myFetch(urlProductByUPC);
  };
  
  
  export default fetchProductByUPC;
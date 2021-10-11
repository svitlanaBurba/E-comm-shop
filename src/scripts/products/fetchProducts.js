// import products from "./products";

const fetchProducts = async () => {
  const response = await fetch('http://localhost:3030/products?category.id=pcmcat274200050008')
  .catch((err) => console.log(err));
  if (response) {
    return response.json();
  }
  console.log(response)
  return response;
};

export default fetchProducts;

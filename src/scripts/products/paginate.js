const paginate = (products, perPage) => {
    const numberOfPages = Math.ceil(products.length / perPage);
  
    const paginatedProducts = Array.from({ length: numberOfPages }, (_, index) => {
      const start = index * perPage;
      return products.slice(start, start + perPage)
    })
    return paginatedProducts;
  }
  
  export default paginate;
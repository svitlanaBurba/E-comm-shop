const setupCategories = (categories, categoryImages) => {
    // first category in a list is our main category (others are it's sub categories), so we can rename it to "All"
    categories[0].name = "All";
  
    // if array with category images was provided then enrich with image links - for main page only
    if (categoryImages) {
      categories.forEach( (category, index) => category.img = categoryImages[index].webformatURL);
    }
  
    let filteredCategories = categories.filter(category=>category.count>0);
  
    return filteredCategories;
  };

  export default setupCategories;
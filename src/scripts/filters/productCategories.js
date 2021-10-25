import {getElement} from '../utils';

// renders whole products section - list of products and list of categories (works as a filter)
export const setupProductCategorySection = (
    categories,
    selectedCategoryId,
    onCategorySelected
  ) => {
    // if there are no categories to render - quit
    if (!categories) return;
    // adding 'All' category before the render - it will have empty categoryId
    const categoriesWithAll = [
      {
        id: "",
        name: "All",
        count: categories[0].count,
      },
      ...categories.filter(
        (category) => category.count > 0
      ),
    ];
  
    // if there is no category selected then set it to empty which means 'All'
    if (!selectedCategoryId) selectedCategoryId = "";
  
    // render 'Categories' filter
    setupProductCategories(
      categoriesWithAll,
      selectedCategoryId,
      onCategorySelected
    );
  };

const setupProductCategories = (categories, selectedCategoryId, onSelected) => {
    // render filter buttons for categories
    renderProductCategories(categories, selectedCategoryId);

    // add listener for filter button block
    getElement('.products-nav').addEventListener('click', function (e) {
        if (e.target.classList.contains('products-nav__link')) {     
            const selectedCategoryId = e.target.dataset.categoryId;
            renderProductCategories(categories, selectedCategoryId);

            onSelected(selectedCategoryId);
        }
    });
}

const renderProductCategories = (categories, selectedCategoryId) => {
    const productFilterDOM = getElement('.products-nav');
    productFilterDOM.innerHTML = categories
        .map(category => renderProductCategoryBtn(category, category.id === selectedCategoryId))
        .join('');
}

const renderProductCategoryBtn = (category, isActive) => {
    // if btn should be marked as active - add 'active' class to it
    const activeClass = (isActive) ? 'active' : '';

    return `<li>
                <a href="#${category.name}" class="products-nav__link ${activeClass}" data-category-id="${category.id}">${category.name}<span>(${category.count})</span></a>
              </li>`;
}


export default setupProductCategories;
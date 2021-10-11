import {getElement} from '../utils';

const setupProductCategories = (categories, renderSelectedProducts, selectedCategory) => {

    // render filter buttons for categories
    renderProductCategoryBtns(categories, selectedCategory);

    // add listener for filter button block
    getElement('.products-nav').addEventListener('click', function (e) {
        //
        if (e.target.classList.contains('products-nav__link')) {     
            const selectedCategory = e.target.dataset.category;

            renderSelectedProducts(selectedCategory);
            renderProductCategoryBtns(categories, selectedCategory);
        }
    });
}

const renderProductCategoryBtns = (categories, selectedCategory) => {
    const productFilterDOM = getElement('.products-nav');
    productFilterDOM.innerHTML = categories
        .map(category => renderProductCategoryBtn(category.name, category.count, category.name === selectedCategory))
        .join('');
}

const renderProductCategoryBtn = (categoryName, categoryCount, isActive) => {
    // if btn should be marked as active - add 'active' class to it
    const activeClass = (isActive) ? 'active' : '';

    return `<li>
                <a href="#${categoryName}" class="products-nav__link ${activeClass}" data-category="${categoryName}">${categoryName}<span>(${categoryCount})</span></a>
              </li>`;
}



export default setupProductCategories;
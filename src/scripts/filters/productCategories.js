import renderProducts from "../products/renderProducts";
import {getElement} from '../utils';

const setupProductCategories = products => {
    // Create a list of categories from the product list (and add 'All' synthetic cateogy)
    let productCategories = [
        'All',
        ...new Set(products.flatMap(product => product.categories.map(category=>category.name)))
    ];

    // render filter buttons for categories
    const productFilterDOM = getElement('.products-nav');
    productFilterDOM.innerHTML = productCategories
        .map(category => renderProductCategoryBtn(category, category === 'All'))
        .join('');

    // add listener for filter button block
    productFilterDOM.addEventListener('click', function (e) {
        const element = e.target;
        const selectedCategory = e.target.textContent;

        if (element.classList.contains('products-nav__link')) {     
            // create filtered list of products (for selected category only)
            let selectedCategoryProducts = (selectedCategory === 'All') ? 
                [...products] :
                products.filter(product => product.categories.map(category=>category.name).includes(selectedCategory));
            
            // mark selected category button as 'Active'
            document.querySelectorAll('.products-nav__link').forEach(el => el.classList.remove('active'));
            element.classList.add('active');
            
            // render products cards for a selected category
            renderProducts(
            selectedCategoryProducts,
            document.querySelector('.products__list')
        );
        }
    });
}


const renderProductCategoryBtn = (btnName, isActive) => {
    // if btn should be marked as active - add 'active' class to it
    const activeClass = (isActive) ? 'active' : '';

    return `<li>
                <a href="#${btnName}" class="products-nav__link ${activeClass}">${btnName}</a>
              </li>`;
}



export default setupProductCategories;
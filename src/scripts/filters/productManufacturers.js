import {getElement} from '../utils';

const setupProductManufacturers = (manufacturers, selectedManufacturer, onSelected) => {
    // render filter buttons for manufacturers
    renderManufacturers(manufacturers, selectedManufacturer);

    // add listener for filter button block
    getElement('.manufacturers-nav').addEventListener('click', function (e) {
        //
        if (e.target.classList.contains('manufacturers-nav__link')) {     
            const selectedManufacturerName = e.target.dataset.manufacturerName;
            renderManufacturers(manufacturers, selectedManufacturerName);

            onSelected(selectedManufacturerName);
        }
    });
}

const renderManufacturers = (manufacturers, selectedManufacturerName) => {
    const productFilterDOM = getElement('.manufacturers-nav');
    productFilterDOM.innerHTML = manufacturers
        .map(manufacturer => renderProductManufacturerBtn(manufacturer, manufacturer === selectedManufacturerName))
        .join('');
}

const renderProductManufacturerBtn = (manufacturer, isActive) => {
    // if btn should be marked as active - add 'active' class to it
    const activeClass = (isActive) ? 'active' : '';

    return `<li>
                <a class="manufacturers-nav__link ${activeClass}" data-manufacturer-name="${manufacturer}">${manufacturer}</a>
              </li>`;
}



export default setupProductManufacturers;
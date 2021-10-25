import productManufacturerFilterTemplate from '../../templates/productManufacturerFilter.hbs'


export const setupManufacturerSection = (
    container,
    manufacturers,
    onManufacturerSelected
  ) => {
    // add 'All' option
    const manufacturersWithAll = [
      {
        id: "",
        name: "All",
        count: manufacturers.reduce((a, v) => a + v.count, 0),
        isActive: true,
      },
      ...manufacturers,
    ];
  
    setupProductManufacturers(
      container,
      manufacturersWithAll,
      onManufacturerSelected
    );
  };

const setupProductManufacturers = (container, manufacturers, onSelected) => {
    // render filter buttons for manufacturers
    container.innerHTML = productManufacturerFilterTemplate(manufacturers);

    // add listener for filter button block
    container.addEventListener('click', function (e) {
        //
        if (e.target.classList.contains('manufacturers-nav__link')) {     
            const selectedManufacturerName = e.target.dataset.manufacturerName;
            // set isActive flag for a selected manufacturer, drop for others
            manufacturers.forEach(manufacturer => manufacturer.isActive = (manufacturer.name === selectedManufacturerName))
            // render manufactureres
            container.innerHTML = productManufacturerFilterTemplate(manufacturers);

            onSelected(selectedManufacturerName);
        }
    });
}

export default setupProductManufacturers;

const setupSearch = (searchInputElement,onChange) => {

  searchInputElement.addEventListener('input', async () => {
   onChange(searchInputElement.value);
  });
};

export default setupSearch;
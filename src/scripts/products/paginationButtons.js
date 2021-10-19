import productPageButtonsTemplate from "../../templates/productPageButtonsTemplate.hbs";

const renderPagesButtons = (container, numPages, activeIndex) => {
  if (!numPages || numPages === 0) {
    container.innerHTML = "";
    return;
  }

  // save params in container dataset - for listeners
  container.dataset.numPages = numPages;
  container.dataset.activeIndex = activeIndex;

  // we only display button for active index, 1 before and 1 after
  const pagesToDisplay = [...Array(numPages).keys()].filter(
    (index) => index >= activeIndex - 1 && index < activeIndex + 2
  );

  let buttonsToRender = pagesToDisplay.map((page) => ({
    index: page,
    name: page < 9 ? `0${page + 1}.` : `${page + 1}.`,
    isActive: activeIndex === page,
  })
  );

  container.innerHTML = productPageButtonsTemplate(buttonsToRender);

};

const initProductPaginationBtns = (container, onPageSelected) => {
  container.addEventListener("click", function (e) {
    const numPages = parseInt(container.dataset.numPages);
    const activeIndex = parseInt(container.dataset.activeIndex);
    let index = 0;

    if (e.target.classList.contains("btn-container")) return;
    if (e.target.classList.contains("page-btn")) {
      index = parseInt(e.target.dataset.index);
    }
    if (e.target.classList.contains("btn-next")) {
      index = activeIndex + 1;
      if (index > numPages - 1) {
        index = 0;
      }
    }
    if (e.target.classList.contains("btn-prev")) {
      index = activeIndex - 1;
      if (index < 0) {
        index = numPages - 1;
      }
    }

    container.dataset.activeIndex = index;
    renderPagesButtons(container, numPages, index);

    onPageSelected(index);
  });
};

export { renderPagesButtons, initProductPaginationBtns };

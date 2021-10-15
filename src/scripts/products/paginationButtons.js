const renderPagesButtons = (container, numPages, activeIndex) => {

    if (!numPages || numPages===0) {
      container.innerHTML = '';
      return;
    }

    // we only show active index btn, 1 before and 1 after it
    const pagesToDisplay = [...Array(numPages).keys()].filter(index => index >= activeIndex-1 && index < activeIndex + 2);

    let buttons = pagesToDisplay.map(page => {
        return `<span class="page-btn ${
            activeIndex === page ? 'active-btn' : 'null'
        }" data-index="${page}">
        ${page<9 ? `0${page + 1}.` : `${page + 1}.`}
  </span>`
    })
    buttons.push(`<div class="btn-next"> next<span class="arrow-icon">&#8594</span></div>`)
    buttons.unshift(`<div class="btn-prev"><span class="arrow-icon">&#8592</span> prev</div>`)
    container.innerHTML = buttons.join('');
    container.dataset.numPages = numPages;
    container.dataset.activeIndex = activeIndex;
  }

  const initProductPaginationBtns = (container, onPageSelected) => {
  
    container.addEventListener('click', function (e) {
      const numPages = parseInt(container.dataset.numPages);
      const activeIndex = parseInt(container.dataset.activeIndex);
      let index = 0;
  
      if (e.target.classList.contains('btn-container')) return;
      if (e.target.classList.contains('page-btn')) {
        index = parseInt(e.target.dataset.index);
      }
      if (e.target.classList.contains('btn-next')) {
        index=activeIndex+1;
        if (index > numPages - 1) {
          index = 0;
        }
      }
      if (e.target.classList.contains('btn-prev')) {
        index=activeIndex-1;
        if (index < 0) {
          index = numPages - 1;
        }
      }
  
      container.dataset.activeIndex = index;
      renderPagesButtons(container, numPages, index); 
      
      onPageSelected(index);
    })
  }

  
  
  export {renderPagesButtons,initProductPaginationBtns};
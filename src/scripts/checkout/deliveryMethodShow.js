export const initCollapsibleSections = container => {
  if (container) {
    container.addEventListener('click', e => {
      if (e.target.closest('.collapsible-section-btn')) {
        expandSelectedSection(container);
      }
    });

    expandSelectedSection(container);
  }
};

const expandSelectedSection = container => {
  [...container.children].forEach(item => {
    let radio = item.querySelector('.collapsible-section-btn');
    let section = item.querySelector('.collapsible-section');

    if (!radio || !section) return;

    if (radio.checked) {
      expandSection(section);
    } else {
      collapseSection(section);
    }
  });
};

const collapseSection = target => {
  // simple version
  target.style.display = 'none';
 

  /*     let duration = 1000;
  target.style.transitionProperty = 'height, margin, padding';
  target.style.transitionDuration = duration + 'ms';
  target.style.height = target.offsetHeight + 'px';
  target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.style.display = 'none';
  
    
  window.setTimeout(() => {
    target.style.display = 'none';
    target.style.removeProperty('height');
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
    target.style.removeProperty('transition-property');
  }, duration); */
};

const expandSection = target => {
  // simple version
  target.style.removeProperty('display');
  

  //if (window.getComputedStyle(target).display === 'none') target.style.display = 'block';

  /* 
    let duration = 1000;
      target.style.removeProperty('display');
  let display = window.getComputedStyle(target).display;
    if (display === 'none') display = 'block';
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';

    target.style.display = display;
  let height = target.offsetHeight;
  target.style.overflow = 'hidden';
  target.style.height = 0;
  target.style.paddingTop = 0;
  target.style.paddingBottom = 0;
  target.style.marginTop = 0;
  target.style.marginBottom = 0;
  target.offsetHeight;
  target.style.height = height + 'px';
  target.style.removeProperty('padding-top');
  target.style.removeProperty('padding-bottom');
  target.style.removeProperty('margin-top');
  target.style.removeProperty('margin-bottom');
    

  window.setTimeout(() => {
    target.style.removeProperty('height');
    target.style.removeProperty('overflow');
    target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      
 
  }, duration);  */
};

import sublinks from './sublinks';

const mobileMenu = () => {
  const menuBtnRef = document.querySelector('[data-menu-button]');
  const mobileMenuRef = document.querySelector('[data-menu]');
  const mobileBtnClose = document.querySelector('[data-menu-close]');

  const mobileMenuSidebar = document.querySelector('.header__nav-list');
  const navLinks = [...document.querySelectorAll('.header__nav-link')];

  const submenu = document.querySelector('.submenu');

  menuBtnRef.addEventListener('click', () => {
    mobileMenuRef.classList.toggle('mobile-menu--is-open');
    menuBtnRef.classList.toggle('mobile-menu--is-open');
  });

  mobileBtnClose.addEventListener('click', () => {
    mobileMenuRef.classList.toggle('mobile-menu--is-open');
    menuBtnRef.classList.toggle('mobile-menu--is-open');
  });

  // set mobile menu sidebar
  mobileMenuSidebar.innerHTML = sublinks
    .map(item => {
      const { links, page } = item;
      return `<article class="header__nav-article">
<h4 class="header__nav-title">${page}</h4>
<div class="header__nav-sublinks">
${links
  .map(link => {
    return `<a href="${link.href}"><i class="${link.icon}"></i>${link.name}</a>`;
  })
  .join('')}
</div>
</article>`;
    })
    .join('');

  navLinks.forEach(btn => {
    btn.addEventListener('mouseover', function (e) {
      const text = e.currentTarget.textContent;
      const tempBtn = e.currentTarget.getBoundingClientRect();
      const center = (tempBtn.left + tempBtn.right) / 2 - 40;
      const bottom = tempBtn.bottom;

      const tempPage = sublinks.find(link => link.page === text);
      if (tempPage) {
        const { page, links } = tempPage;
        submenu.classList.add('show');
        submenu.style.left = `${center}px`;
        submenu.style.top = `${bottom}px`;
        // OPTIONAL
        let columns = 'col-2';
        if (links.length === 3) {
          columns = 'col-3';
        }
        if (links.length > 3) {
          columns = 'col-4';
        }
        submenu.innerHTML = `
          <section> 
          <h4>${page}</h4>
          <div class="submenu-center ${columns}">
          ${links
            .map(link => {
              return `<a href="${link.href}"><i class="${link.icon}"></i>${link.name}</a>`;
            })
            .join('')}
          </div>
          </section>
          `;
      }

      const navSubLinks = [...document.querySelectorAll('.submenu a')];
      navSubLinks.forEach(subLink => {
        subLink.addEventListener('click', function () {
          submenu.classList.remove('show');
        });
      });
    });

    const headerNavSubLinks = [...document.querySelectorAll('.header__nav-list.nav-menu a')];
    headerNavSubLinks.forEach(subLink => {
      subLink.addEventListener('click', function () {
        mobileMenuRef.classList.toggle('mobile-menu--is-open');
        menuBtnRef.classList.toggle('mobile-menu--is-open');
      });
    });
  });

  document.addEventListener('mouseover', function (e) {
    if (!e.target.classList.contains('header__nav-link') && !e.target.closest('.submenu')) {
      submenu.classList.remove('show');
    }
  });
};

export default mobileMenu;

import { getElement } from "../utils";

export const toggleShopSidebar = () => {

    const sidebar = getElement('.shop-sidebar');
    if(sidebar) {
        const openSidebarBtn = getElement('.shop-sidebar__button');
        const closeSidebarBtn = getElement('.shop-sidebar__button-close');
    
        openSidebarBtn.addEventListener('click', () => {
            if(sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
            } else {
                sidebar.classList.add('show');
            }
        })
    
        closeSidebarBtn.addEventListener('click', () => {
            sidebar.classList.remove('show');
        })
    
        document.body.addEventListener('click', (e) => {
            if(!e.target.closest('.shop-sidebar')) {
                if(e.target.closest('.shop-sidebar__button')) {
                    return;
                } else {
                    sidebar.classList.remove('show');
    
                }
            }
        })
    } 
  };


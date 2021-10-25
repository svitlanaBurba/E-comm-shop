import "core-js/stable";
import "regenerator-runtime/runtime";

import './styles/styles.scss';

import onCheckout1Load from './scripts/checkout1';
import onCheckout2Load from './scripts/checkout2';
import onShopLoad from './scripts/shop';
import onProductLoad from './scripts/product';
import onMainLoad from './scripts/main';
import mobileMenu from "./scripts/header/mobileMenu";
import initHeader from "./scripts/header/initHeader";


const page = document.getElementsByTagName("head")[0].dataset['page'];

if (page === 'shop') {
  onShopLoad();
}

if (page === 'product') {
  onProductLoad();
}

if (page === 'checkout2') {
  onCheckout2Load();
}

if (page === 'checkout1') {
  onCheckout1Load();
}

if (page === 'index') {

  window.addEventListener('DOMContentLoaded', onMainLoad);

}

window.addEventListener('DOMContentLoaded', () =>{
  mobileMenu();
  initHeader();
});
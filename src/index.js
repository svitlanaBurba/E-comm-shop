import './styles/styles.scss';

import onCheckout1Load from './scripts/checkout1';
import onCheckout2Load from './scripts/checkout2';
import onMainLoad from './scripts/main';



const page = document.getElementsByTagName("head")[0].dataset['page'];

if (page === 'checkout2') {
  onCheckout2Load();
}

if (page === 'checkout1') {
  onCheckout1Load();
}

if (page === 'index') {

  window.addEventListener('DOMContentLoaded', onMainLoad);

}

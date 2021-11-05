import * as $ from 'jquery';
import { setupCart } from './cart/setupCart';


const onCheckout3Load = () => {
  $(document).ready(function () {
    setupCart();
    
   });
};


export default onCheckout3Load;

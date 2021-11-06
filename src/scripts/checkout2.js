import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
// import custom validator for names
import './formValidators/nameValidator';
import { setupCart } from './cart/setupCart';
import { fetchOpenOrder, saveOrder } from './api/fetchOrder';
import { getFormData, getStorageItem, setStorageItem } from './utils';

let order = {};
let paymentForm;

const onCheckout2Load = async () => {

    order = await fetchOpenOrder();
    setupCart();
    addFormInputMasks();
    addFormInputValidation();
    
    paymentForm = document.getElementById('payment-form');
    paymentForm.addEventListener("submit", handlePaymentFormSubmit);
    paymentForm.addEventListener('change', handlePaymentFormChange);

};

const handlePaymentFormChange = () => {

  const formData = getFormData(paymentForm);

  if (!formData) return;
  order.paymentData = formData;
  saveOrder(order);
}

const handlePaymentFormSubmit = (e) => {
  e.preventDefault();

  // at last step we need to:
  // 1. save latest payment data on the order
  const formData = getFormData(paymentForm);
  order.paymentData = formData;
  // 2. save cart on the order
  order.cart = getStorageItem('cart');
  // 3. set order status as confirmed
  order.status = 'confirmed';
  // 4. clean up the cart
  setStorageItem('cart',[])
  // save order
  saveOrder(order);
  // go to confirmation
  window.location.href='checkout3.html';
}


const addFormInputMasks = () => {
  $(document).ready(function () {
    $('.card-number').mask('0000-0000-0000-0000');
  });

  $(document).ready(function () {
    $('.expiration-year').mask('00');
  });

  $(document).ready(function () {
    $('.expiration-month').mask('00');
  });

  $(document).ready(function () {
    $('.security-code').mask('000');
  });
};

const addFormInputValidation = () => {
  // add validation for a form
  $('#payment-form').validate({
    messages: {
      cardNumber: {
        minlength: 'Card number should have 16 digits',
        required: 'Please provide a card number'
      }
    }
  });
};


export default onCheckout2Load;

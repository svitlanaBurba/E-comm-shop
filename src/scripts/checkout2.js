import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
// import custom validator for names
import './formValidators/nameValidator';
import setupPaymentFormSubmit from './formHandlers/handlePaymentFormSubmit';


const onCheckout2Load = () => {
  $(document).ready(function () {
    addFormInputMasks();
    addFormInputValidation();
    setupPaymentFormSubmit();
   });
};

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

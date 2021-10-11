import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
// import custom validator for names
import './formValidators/nameValidator';
import './formValidators/inListValidator';
import './formValidators/phoneNumberValidator';
import './formValidators/emailValidator';

import handleDeliveryFormSubmit from './formHandlers/handleDeliveryFormSubmit';

const onCheckout1Load = () => {
  $(document).ready(function () {
    addFormInputMasks();
    addFormInputValidation(handleDeliveryFormSubmit);
  });
};

const addFormInputMasks = () => {
  // add mask for the phone
  $('.phone_with_ddd').mask('(+38)Z00-000-00-00', {
    translation: {Z: {pattern: /0/}}
  });
};

const addFormInputValidation = (submitCallback) => {

  // add validation for a form
  $('#delivery-form').validate({    
    rules: {
      userName: {
        required: true,
        nameValidator: true
      },
      userLastName: {
        required: true,
        nameValidator: true
      },
      userPhone: {
        required: true,
        phoneNumberValidator:true
      },
      userEmail:{
        required:true,
        emailValidator:true,
      }
    },
    messages: {
      userLastName: {
        nameValidator:
          'Last Name can only contain letters, asterisc, dots, commas and apostrophes'
      },
        userPhone:{ 
          required: "Please input phone number"
      }
    },
    submitHandler: function(form,event){submitCallback(event);form.submit();},
  });
};

export default onCheckout1Load;

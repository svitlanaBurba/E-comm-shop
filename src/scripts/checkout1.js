import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
// import custom validator for names
import './formValidators/nameValidator';
import './formValidators/inListValidator';

const onCheckout1Load = () => {
  $(document).ready(function () {
    addFormInputMasks();
    addFormInputValidation();
  });
};

const addFormInputMasks = () => {
  // add mask for the phone
  $('.phone_with_ddd').mask('(+38)Z00-000-00-00', {
    translation: {Z: {pattern: /0/}}
  });
};

const addFormInputValidation = () => {
  // add validation for a form
  $('#delivery-form').validate({
    onkeyup: true,
    rules: {
      userName: {
        required: true,
        nameValidator: true
      },
      userLastName: {
        required: true,
        nameValidator: true
      }
      /*       userCountry: {
        required: true,
        inListValidator: {param: ['UA', 'US']}
      } */
    },
    messages: {
      userLastName: {
        nameValidator:
          'Last Name can only contain letters, asterisc, dots, commas and apostrophes'
      }
    }
  });
};

export default onCheckout1Load;

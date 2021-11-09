import * as $ from 'jquery';
import 'jquery-validation';
import 'jquery-mask-plugin';


export const addFormInputMasks = () => {
    // add mask for the phone
    $('.phone_with_ddd').mask('(+38)Z00-000-00-00', {
      translation: { Z: { pattern: /0/ } },
    });
  };

export const initDeliveryFormValidation = onFormSubmit => {
    // add validation for a form
    $('#delivery-form').validate({
      rules: {
        userName: {
          required: true,
          nameValidator: true,
        },
        userLastName: {
          required: true,
          nameValidator: true,
        },
        userPhone: {
          required: true,
          phoneNumberValidator: true,
        },
        userEmail: {
          required: true,
          emailValidator: true,
        },
        pickupStore: {
          required:true,
        }
      },
      messages: {
        userLastName: {
          nameValidator: 'Last Name can only contain letters, asterisc, dots, commas and apostrophes',
        },
        userPhone: {
          required: 'Please input phone number',
        },
      },
      submitHandler: onFormSubmit,
    });
  };
  
import * as $ from 'jquery';

$.validator.addMethod(
  'creditCardNumberValidator',
  function (value, element) {
    return this.optional(element) || /^[a-z ,.'-]+$/i.test(value);
  },
  'Name can only contain letters, asterisc, dots, commas and apostrophes'
);

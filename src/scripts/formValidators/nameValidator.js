import * as $ from 'jquery';

$.validator.addMethod(
  'nameValidator',
  function (value, element) {
    return this.optional(element) || /^[a-z ,.'-]+$/i.test(value);
  },
  'Name can only contain letters, asterisc, dots, commas and apostrophes'
);

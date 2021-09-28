import * as $ from 'jquery';

$.validator.addMethod(
  'phoneNumberValidator',
  function (value, element) {
    return this.optional(element) || /\(\+38\)[0-9]{3}-[0-9]{3}-[0-9]{2}-[0-9]{2}$/i.test(value);
  },
  'Please provide phone number as (+38)0XX-XXX-XX-XX'
);

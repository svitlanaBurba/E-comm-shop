import * as $ from 'jquery';

$.validator.addMethod(
  'inListValidator',
  function (value, element, list) {
    return list.indexOf(value) > 0;
  },
  'Please select a valid value from the list only'
);

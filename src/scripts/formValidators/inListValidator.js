import * as $ from 'jquery';

$.validator.addMethod(
  'inListValidator',
  function (value, element, list) {
    console.log('validator', list);
    console.log(list.indexOf(value));
    return list.indexOf(value) > 0;
  },
  'Please select a valid value from the list only'
);

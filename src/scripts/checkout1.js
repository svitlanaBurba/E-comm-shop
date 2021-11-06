import * as $ from 'jquery';
import 'jquery-mask-plugin';
import 'jquery-validation';
import deliveryFormTemplate from '../templates/deliveryFormTemplate.hbs';
import { fetchDetailedDeliveryCost } from './api/fetchDeliveryCost';
import { fetchOrder, saveOrder } from './api/fetchOrder';
import { renderCart } from './cart/renderCart';
import { setupCart } from './cart/setupCart';
import { getCartTotals } from './cart/utils';
import { initCollapsibleSections } from './checkout/deliveryMethodShow';
import { initStoreSelection as setupStoreSelection, showStoreSelection } from './checkout/storeSelection';
import handleDeliveryFormSubmit from './formHandlers/handleDeliveryFormSubmit';
import './formValidators/emailValidator';
import './formValidators/inListValidator';
// import custom validator for names
import './formValidators/nameValidator';
import './formValidators/phoneNumberValidator';
import { getStorageItem } from './utils';



let cart;
let form;
let autocomplete;
let address1Field;
let address2Field;
let postalField;
let order = {};

window.initMap = function () {};

const onCheckout1Load = async () => {
  
  // fetch order data
  order = await fetchOrder();
  // add cart totals to order
  cart = getStorageItem('cart');
  // calculate cart totals 
  order.cartTotals = getCartTotals(cart);
  order.deliveryCost = await fetchDetailedDeliveryCost(order.cartTotals.productsCost, cart);
   
  // render and init form
  setupDeliveryDataForm(order.deliveryData);
  // render cart
  renderCart(cart);

  // setup modal window for pickup store selection (will remain hidden)
  setupStoreSelection(onStoreSelected);
};

const setupDeliveryDataForm = deliveryData => {
  // add additional flags for handlebars rendering
  if (deliveryData) {
    deliveryData.isPickupSelected = (deliveryData.deliveryType === 'pickupDelivery' && deliveryData.pickupStore)
    deliveryData.isAtHomeSelected = (deliveryData.deliveryType === 'atHomeDelivery')
  }
  // render
  document.getElementById('delivery-form-container').innerHTML = deliveryFormTemplate(deliveryData);
  form = document.getElementById('delivery-form');
  // add masks and validation etc
  addFormInputMasks();
  addFormInputValidation(onDeliveryFormSubmit); // validation includes submit handler which is passed as a callback param
  initAutocomplete();
  initCollapsibleSections(document.querySelector('.delivery-methods'));

  // add listeners for controls
  form.addEventListener('change', saveFormDataToOrder);
  document.querySelector('.pickup-btn').addEventListener('click', showStoreSelection);
};

const addFormInputMasks = () => {
  // add mask for the phone
  $('.phone_with_ddd').mask('(+38)Z00-000-00-00', {
    translation: { Z: { pattern: /0/ } },
  });
};

const addFormInputValidation = onFormSubmit => {
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

function initAutocomplete() {
  address1Field = document.querySelector('#userShipAddress');
  address2Field = document.querySelector('#userAddressDetails');
  postalField = document.querySelector('#userPostcode');
  // Create the autocomplete object, restricting the search predictions to
  // addresses in the US and Ukraine.
  autocomplete = new google.maps.places.Autocomplete(address1Field, {
    // componentRestrictions: { country: ["us", "ukr"] },
    fields: ['address_components', 'geometry'],
    types: ['address'],
  });
  address1Field.focus();
  // When the user selects an address from the drop-down, populate the
  // address fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();

  let address1 = '';
  let postcode = '';

  // Get each component of the address from the place details,
  // and then fill-in the corresponding field on the form.
  // place.address_components are google.maps.GeocoderAddressComponent objects
  // which are documented at http://goo.gle/3l5i5Mr
  for (const component of place.address_components) {
    const componentType = component.types[0];

    switch (componentType) {
      case 'street_number': {
        address1 = `${component.long_name} ${address1}`;
        break;
      }

      case 'route': {
        address1 += component.short_name;
        break;
      }

      case 'postal_code': {
        postcode = `${component.long_name}${postcode}`;
        break;
      }

      case 'postal_code_suffix': {
        postcode = `${postcode}-${component.long_name}`;
        break;
      }
      case 'locality':
        document.querySelector('#userCity').value = component.long_name;
        break;
      case 'administrative_area_level_1': {
        document.querySelector('#userState').value = component.short_name;
        break;
      }
      case 'country':
        document.querySelector('#userCountry').value = component.long_name;
        break;
    }
  }

  address1Field.value = address1;
  postalField.value = postcode;
  // After filling the form with address components from the Autocomplete
  // prediction, set cursor focus on the second address line to encourage
  // entry of subpremise information such as apartment, unit, or floor number.
  address2Field.focus();
}

const saveFormDataToOrder = () => {
  const formData = handleDeliveryFormSubmit(form);
  // form does not have pickupStore info and we are going to oberwrite order.deliveryData with formData
  // so if order already has some deliveryData - take pickupStore info from it and save to formData
  if (order.deliveryData) formData.pickupStore = order.deliveryData.pickupStore;
  order.deliveryData = formData;
  saveOrder(order);
};

const onStoreSelected = store => {
  order.deliveryData.pickupStore = store;
  saveOrder(order);

  document.querySelector('.delivery-form__pickup-store_address').innerHTML = `${store.name}: ${store.address}, ${store.city}, ${store.state}`;
};

const onDeliveryFormSubmit = (form,e) => {
  e.preventDefault();
  const formData = handleDeliveryFormSubmit(e.target);
  if (order.deliveryData) formData.pickupStore = order.deliveryData.pickupStore;
  order.deliveryData = formData;
  saveOrder(order);
  location.href = 'checkout2.html';
};

export default onCheckout1Load;

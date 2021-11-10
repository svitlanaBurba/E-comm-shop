import { fetchDetailedDeliveryCost } from './api/fetchDeliveryCost';
import { fetchOpenOrder, saveOrder } from './api/fetchOrder';
import { renderCart, renderCartTotal } from './cart/renderCart';
import { getCartTotals } from './cart/utils';
import { addFormInputMasks, initDeliveryFormValidation } from './checkout/deliveryFormValidation';
import { initCollapsibleSections } from './checkout/deliveryMethodShow';
import { initAddressAutocomplete } from './checkout/initAddressAutocomplete';
import { initStoreSelection as setupStoreSelection, showStoreSelection } from './checkout/storeSelection';
import { getFormData, getStorageItem } from './utils';
import deliveryFormTemplate from '../templates/deliveryFormTemplate.hbs';
// import custom validator for names
import './formValidators/emailValidator';
import './formValidators/inListValidator';
import './formValidators/nameValidator';
import './formValidators/phoneNumberValidator';

let cart;
let order = {};
let form;

window.initMap = function () {};

const onCheckout1Load = async () => {
  // fetch order data
  order = await fetchOpenOrder();
  // fetch cart data
  cart = getStorageItem('cart');
  // calculate cart totals and save on the order (delivery cost is preliminary now)
  // need to do this every time because cart could have changed
  order.totals = getCartTotals(cart);
  // calculate detailed delivery costs
  order.deliveryData.deliveryCost = await fetchDetailedDeliveryCost(order.totals.productsCost);
  // calculate order total cost with detailed delivery data
  recalculateOrderTotals(order);

  // render and init delivery data form
  setupDeliveryDataForm(order.deliveryData);
  // render cart
  renderCart(cart);
  // render order summary (totals)
  renderCartTotal(order.totals);

  // setup modal window for pickup store selection (will remain hidden)
  setupStoreSelection(onStoreSelected);
};

const setupDeliveryDataForm = deliveryData => {
  // add additional boolean flags for handlebars rendering
  if (deliveryData)
    deliveryData.flags = {
      isPickupSelected: deliveryData.deliveryType === 'pickupDelivery' && deliveryData.pickupStore,
      isAtHomeSelected: deliveryData.deliveryType === 'atHomeDelivery',
      isAtHomeStandardSelected: deliveryData.atHomeDeliveryType === 'atHomeDeliveryTypeStandard',
      isAtHomeExpressSelected: deliveryData.atHomeDeliveryType === 'atHomeDeliveryTypeExpress',
    };

  // render form with handlebars
  document.getElementById('delivery-form-container').innerHTML = deliveryFormTemplate(deliveryData);
  form = document.getElementById('delivery-form');
  // add masks and validation etc
  addFormInputMasks();
  initDeliveryFormValidation(onDeliveryFormSubmit); // validation includes submit handler which is passed as a callback param
  initAddressAutocomplete();
  initCollapsibleSections(document.querySelector('.delivery-methods'));

  // add listeners for controls
  form.addEventListener('change', processDeliveryFormChange);
  document.querySelector('.pickup-btn').addEventListener('click', showStoreSelection);
};

// this processes every user change in form inputs including text and radio
const processDeliveryFormChange = e => {
  const changedElement = e.target;
  const formData = getFormData(form);
  // form does not have pickupStore info and we are going to overwrite order.deliveryData with formData
  // so if order already has some deliveryData - take pickupStore info from it and save to formData
  // same for delivery cost
  if (order.deliveryData) {
    formData.pickupStore = order.deliveryData.pickupStore;
    formData.deliveryCost = order.deliveryData.deliveryCost;
  }
  order.deliveryData = formData;

  // if change was for radio button then delivery type was changed:
  // need to recalculate order total cost and refresh totals section on page
  if (changedElement.type === 'radio') {
    recalculateOrderTotals(order);
    renderCartTotal(order.totals);
  }

  saveOrder(order);
};

// handles store selection (from the modal window) results
const onStoreSelected = store => {
  // save selected store on the order and save the order
  order.deliveryData.pickupStore = store;
  saveOrder(order);
  // populate address of the selected store on the page
  document.querySelector(
    '.delivery-form__pickup-store_address',
  ).value = `${store.name}: ${store.address}, ${store.city}, ${store.state}`;
};

const onDeliveryFormSubmit = (form, e) => {
  e.preventDefault();
  const formData = getFormData(e.target);
  if (order.deliveryData) formData.pickupStore = order.deliveryData.pickupStore;
  order.deliveryData = formData;
  saveOrder(order);
  location.href = 'checkout2.html';
};

const recalculateOrderTotals = order => {
  // we need to update order totals with selected delivery cost and calculate total price of the order
  order.totals.deliveryCost = undefined; // drop delivery cost - we will calculate it now (and if delivery method is not selected t will be empty)
  order.totals.totalCost = undefined;
  order.totals.deliveryDate = undefined;

  // identify selected delivery cost and set it's value in order.totals.deliveryCost
  if (order.deliveryData.deliveryType === 'atHomeDelivery') {
    if (order.deliveryData.atHomeDeliveryType === 'atHomeDeliveryTypeExpress') {
      order.totals.deliveryCost = order.deliveryData.deliveryCost.expressDelivery;
      order.totals.deliveryDate = order.deliveryData.deliveryCost.expressDeliveryDate;
    } else if (order.deliveryData.atHomeDeliveryType === 'atHomeDeliveryTypeStandard') {
      order.totals.deliveryCost = order.deliveryData.deliveryCost.standardDelivery;
      order.totals.deliveryDate = order.deliveryData.deliveryCost.standardDeliveryDate;
    }
  } else if (order.deliveryData.deliveryType === 'pickupDelivery') {
    order.totals.deliveryCost = order.deliveryData.deliveryCost.pickupDelivery;
    order.totals.deliveryDate = order.deliveryData.deliveryCost.pickupDeliveryDate;
  }
  // calculate total cost
  if (order.totals.deliveryCost !== undefined) {
    order.totals.totalCost =
      order.totals.productsCost + order.totals.discount + order.totals.servicesCost + order.totals.deliveryCost;
  }
};

export default onCheckout1Load;

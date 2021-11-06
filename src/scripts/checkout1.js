import deliveryFormTemplate from '../templates/deliveryFormTemplate.hbs';
import { fetchDetailedDeliveryCost } from './api/fetchDeliveryCost';
import { fetchOpenOrder, saveOrder } from './api/fetchOrder';
import { renderCart, renderCartTotal } from './cart/renderCart';
import { getCartTotals } from './cart/utils';
import { addFormInputMasks, initDeliveryFormValidation } from './checkout/deliveryFormValidation';
import { initCollapsibleSections } from './checkout/deliveryMethodShow';
import { initAddressAutocomplete } from './checkout/initAddressAutocomplete';
import { initStoreSelection as setupStoreSelection, showStoreSelection } from './checkout/storeSelection';
import handleDeliveryFormSubmit from './formHandlers/handleDeliveryFormSubmit';
import './formValidators/emailValidator';
import './formValidators/inListValidator';
// import custom validator for names
import './formValidators/nameValidator';
import './formValidators/phoneNumberValidator';
import { formatPrice, getStorageItem } from './utils';

let cart;
let form;
let order = {};

window.initMap = function () {};

const onCheckout1Load = async () => {
  // fetch order data
  order = await fetchOpenOrder();
  if (!order.deliveryData) order.deliveryData = {};
  // add get cart data
  cart = getStorageItem('cart');
  // calculate cart totals and save on the order (delivery cost is preliminary now)
  order.totals = getCartTotals(cart);
  // calculate delivery costs
  order.deliveryData.deliveryCost = await getDeliveryCosts(cart);
  recalculateOrderTotals(order);

  // render and init form
  setupDeliveryDataForm(order.deliveryData);

  // render cart
  renderCart(cart);
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
    }
  

  // render
  document.getElementById('delivery-form-container').innerHTML = deliveryFormTemplate(deliveryData);
  form = document.getElementById('delivery-form');
  // add masks and validation etc
  addFormInputMasks();
  initDeliveryFormValidation(onDeliveryFormSubmit); // validation includes submit handler which is passed as a callback param
  initAddressAutocomplete();
  initCollapsibleSections(document.querySelector('.delivery-methods'));

  // add listeners for controls
  form.addEventListener('change', saveFormDataToOrder);
  document.querySelector('.pickup-btn').addEventListener('click', showStoreSelection);
};

const saveFormDataToOrder = e => {
  const changedElement = e.target;
  const formData = handleDeliveryFormSubmit(form);
  // form does not have pickupStore info and we are going to oberwrite order.deliveryData with formData
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

const onStoreSelected = store => {
  order.deliveryData.pickupStore = store;
  saveOrder(order);

  document.querySelector(
    '.delivery-form__pickup-store_address',
  ).innerHTML = `${store.name}: ${store.address}, ${store.city}, ${store.state}`;
};

const onDeliveryFormSubmit = (form, e) => {
  e.preventDefault();
  const formData = handleDeliveryFormSubmit(e.target);
  if (order.deliveryData) formData.pickupStore = order.deliveryData.pickupStore;
  order.deliveryData = formData;
  saveOrder(order);
  location.href = 'checkout2.html';
};

const getDeliveryCosts = async cart => {
  // calculate cart totals - we need total cost of products to request detailed delivery costs
  const cartTotals = getCartTotals(cart);
  // request delivery costs for all available delivery types
  let deliveryCost = await fetchDetailedDeliveryCost(cartTotals.productsCost);

  // let's add formatted prices for handlebars
  deliveryCost.standardDeliveryFormatted = formatPrice(deliveryCost.standardDelivery, 'Free!');
  deliveryCost.expressDeliveryFormatted = formatPrice(deliveryCost.expressDelivery, 'Free!');
  deliveryCost.pickupDeliveryFormatted = formatPrice(deliveryCost.pickupDelivery, 'Free!');

  deliveryCost.homeDeliveryCostRange =
    formatPrice(Math.min(deliveryCost.standardDelivery, deliveryCost.expressDelivery)) +
    '-' +
    formatPrice(Math.max(deliveryCost.standardDelivery, deliveryCost.expressDelivery));

  return deliveryCost;
};

const recalculateOrderTotals = order => {
  // we need to update order totals with selected delivery cost and calculate total price of the order
  order.totals.deliveryCost = undefined; // drop delivery cost - we will calculate it now (and if delivery method is not selected t will be empty)
  order.totals.totalCost = undefined;

  // identify selected cost
  if (order.deliveryData.deliveryType === 'atHomeDelivery') {

    if (order.deliveryData.atHomeDeliveryType === 'atHomeDeliveryTypeExpress')
      order.totals.deliveryCost = order.deliveryData.deliveryCost.expressDelivery;
    if (order.deliveryData.atHomeDeliveryType === 'atHomeDeliveryTypeStandard')
      order.totals.deliveryCost = order.deliveryData.deliveryCost.standardDelivery;
  }

  if (order.deliveryData.deliveryType === 'pickupDelivery')
    order.totals.deliveryCost = order.deliveryData.deliveryCost.pickupDelivery;

  // calculate total cost
  if (order.totals.deliveryCost !== undefined) {
    order.totals.totalCost =
      order.totals.productsCost + order.totals.discount + order.totals.servicesCost + order.totals.deliveryCost;

    }

  // let's add formatted prices for handlebars
  order.totals.deliveryCostFormatted = formatPrice(order.totals.deliveryCost, undefined, '-');
  order.totals.totalCostFormatted = formatPrice(order.totals.totalCost, undefined, '-');
};

export default onCheckout1Load;

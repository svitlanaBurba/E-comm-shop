import pickupDeliveryTemplate from '../../templates/pickupDeliveryModalTemplate.hbs';
import storeDetailsTemplate from '../../templates/pickupDeliveryStoreDetailsTemplate.hbs';
import storeListTemplate from '../../templates/pickupDeliveryStoreListTemplate.hbs';
import fetchStoresByLocation from '../api/fetchStoresByLocation';

// modal window (pickup delivery)
const modal = document.querySelector('.modal-overlay--checkout');
const modalContainer = document.querySelector('.modal-container--checkout');
const closeBtnModal = document.querySelector('.close-btn');

let map;
let stores = [];
let markers = [];
let storeAddressInput;
let autocomplete;
let storeListContainer;
let storeDetailsContainer;
let selectedStore;

const defaultLocation = {
  lat: 41,
  lng: -74,
};
const deafultDistance = 1;

export const initStoreSelection = onStoreChoosen => {
  modalContainer.innerHTML = pickupDeliveryTemplate(stores);
  storeListContainer = document.querySelector('#storeList');
  storeDetailsContainer = document.querySelector('#storeDetails');
  // display map
  map = initMap(document.getElementById('map'));
  // init autocomplete for a store address
  initStoreAddressAutocomplete();
  initStoreList();

  // add listener for a Choose btn - should call a onStoreChoosen callback and pass selectedStore to it
  document.querySelector('#storeChoose').addEventListener('click', () => {
    if (selectedStore) {
      onStoreChoosen(selectedStore);
      modalHide();
    }
  });

  closeBtnModal.addEventListener('click', function () {
    modalHide();
  });
   
};

// this handles a 'Pick store' button
export const showStoreSelection = async () => {
  modalShow();
  storeAddressInput.focus();
  // if this is a first load of a form - fetch and display stores for a deafult location
  // after the first load form will always display something, so no need to fetch data and display
  if (!stores || stores.length === 0) {
    stores = await fetchStoresByLocation(defaultLocation.lat, defaultLocation.lng, deafultDistance);
    displayStoresOnMap();
  }
};

// standard initMap from Google samples
const initMap = (container, center) => {
    const map = new google.maps.Map(container, {
    location:defaultLocation,
    center: center,
    zoom: 9.5,
  });
  return map;
};

// display all the stores from store array on the map
const displayStoresOnMap = () => {
  // calculate a center of the found stores and move map there
  const storesCenter = calcStoresCenter(stores);
  map.panTo(storesCenter);
  map.setZoom(9.5);

  // clear exsiting (old) markers
  markers.forEach(marker => marker.setMap(null));
  markers = [];

  // add new markers
  stores.forEach(store => {
    addStoreMarker(store, map);
  });

  //render store list
  if (storeListContainer) storeListContainer.innerHTML = storeListTemplate(stores);
};

function addStoreMarker(storeData, map) {
  const marker = new google.maps.Marker({
    position: storeData.location,
    label: storeData.city,
    map: map,
  });

  // save storeId on the marker so we will know it when user clicks on marker
  marker.storeId = storeData.id;
  // add onClick listener - when user clicks - select stor
  google.maps.event.addListener(marker, 'click', () => {
    displaySelectedStore(marker.storeId);
  });

  // save added marker to the array so that we will be able to delete it later
  markers.push(marker);
}

const displaySelectedStore = storeId => {
  const store = stores.find(store => store.id === storeId);
  if (!store || !store.location) return;
  selectedStore = store;

  // render details for the selected store
  storeDetailsContainer.innerHTML = storeDetailsTemplate(store);

  // set 'selected' style for the selected store list item
  storeListContainer
    .querySelectorAll('.pickup-store-list-item')
    .forEach(item => item.classList.remove('store-selected'));
  storeListContainer.querySelectorAll(`.pickup-store-list-item[data-store-id='${storeId}']`).forEach(item => {
    item.classList.add('store-selected');
    //item.focus();
  });

  // cemter map on the selected store and zoom in
  map.panTo(store.location);
  map.setZoom(10);
};

function initStoreAddressAutocomplete() {
  storeAddressInput = document.querySelector('#storePicker');
  autocomplete = new google.maps.places.Autocomplete(storeAddressInput, {
    componentRestrictions: { country: ['us'] },
    fields: ['address_components', 'geometry'],
    types: ['address'],
  });


  // when user selects some location - process it
  autocomplete.addListener('place_changed', processStoreAddressAutocomplete);
}

// this will get nearest stores for a choosen location and display them
const processStoreAddressAutocomplete = async () => {
  // Get the place details from the autocomplete object.
  const place = autocomplete.getPlace();
  if (!place || !place.geometry) return;

  // we only need coordinates of the selected address
  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();

  // ask backend for a nearby stores
  stores = await fetchStoresByLocation(lat, lng, deafultDistance);
  // render stores on map
  displayStoresOnMap();
};

const initStoreList = () => {
  // when user clicks on some store in a list we need to move map there and zoom in a bit
  storeListContainer.addEventListener('click', e => {
    // get storeId from target and find store item by this id
    const storeId = Number(e.target.closest('li').dataset.storeId);
    displaySelectedStore(storeId);
  });
};

function calcStoresCenter(stores) {
  const locationSum = stores.reduce((acc, store) => {
    return !acc ? store.location : { lat: acc.lat + store.location.lat, lng: acc.lng + store.location.lng };
  }, undefined);

  const center = { lat: locationSum.lat / stores.length, lng: locationSum.lng / stores.length };
  return center;
}

const modalHide = () => {
  modal.classList.remove('open-modal');
};

const modalShow = () => {
  modal.classList.add('open-modal');
};


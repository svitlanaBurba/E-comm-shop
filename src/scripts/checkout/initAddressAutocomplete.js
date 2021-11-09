
let autocomplete;
let address1Field;

export  function initAddressAutocomplete() {
    address1Field = document.querySelector('#userShipAddress');
    // Create the autocomplete object, restricting the search predictions to
    // addresses in the US and Ukraine.
    autocomplete = new google.maps.places.Autocomplete(address1Field, {
      // componentRestrictions: { country: ["us", "ukr"] },
      fields: ['address_components', 'geometry'],
      types: ['address'],
    });
    //address1Field.focus();
    // When the user selects an address from the drop-down, populate the
    // address fields in the form.
    autocomplete.addListener('place_changed', fillInAddress);
  }
  
  function fillInAddress() {

    const address2Field = document.querySelector('#userAddressDetails');
    const postalField = document.querySelector('#userPostcode');
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
  }
  
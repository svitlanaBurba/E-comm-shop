// import { formatPrice } from "../utils";

export const myFetch = async (url, transformer) => {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        if (typeof transformer === 'function') {
          resolve(transformer(xhr.response));
        } else {
          resolve(xhr.response);
        }
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText,
        });
      }
    };

    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText,
      });
    };

    xhr.send();
  });
};

export const addProductAdditionalProperties = product => {
  // adding price before discount as 'oldPrice'
  const dicsountRate = product.price > 50 ? 0.2 : 0.1;
  product.oldPrice = Math.round(product.price * (1 + dicsountRate) * 100) / 100;
  // adding available stock as 'stock'
  product.stock = product.id % 10;

  // add additional services information
  addAdditionalServices(product);
};


const addAdditionalServices = product => {
  product.additionalServices = [];

  // gift wrapping
  if (product.price > 20) {
    product.additionalServices.push({id: 1, name:'Gift wrapping', cost: 5})
  }

  // extended warranty
  if (product.price > 50) {
    product.additionalServices.push({id: 2, name:'Extended 1 Year Warranty', cost: Math.ceil(product.price * 0.05)})
  }
  // set flag of some services are availble for purchase
  product.additionalServicesAvaliable = (product.additionalServices.length > 0);
}
import modalCreditTemplate from '../../templates/modalCreditTemplate.hbs';
import modalOptionsTemplate from '../../templates/modalOptionsTemplate.hbs';
import { fetchCreditOptionsById } from '../api/fetchCreditOptionsById';
import { getStorageItem } from '../utils';
import { updateCartItemAdditionalServices, updateCartItemCreditData } from './setupCart';

// modal window (servies and credit) elements
const modal = document.querySelector('.modal-overlay');
const modalContainer = document.querySelector('.modal-container');
const closeBtnModal = document.querySelector('.close-btn');

const modalHide = () => {
  modal.classList.remove('open-modal');
};

const modalShow = () => {
  modal.classList.add('open-modal');
};

export const initAdditionalSevices = () => {
  document.querySelector('.cart-page__product-list').addEventListener('click', async e => {
    if (!e.target.classList.contains('cart-addinfo-btn--options')) return;
    // get selected carItem by id - it contains available additional services
    const productId = Number(e.target.dataset.id);
    const cart = getStorageItem('cart');
    const cartItem = cart.find(item => item.id === productId);
    if (!cartItem) return;
    // render and display modal window
    modalContainer.innerHTML = modalOptionsTemplate(cartItem);
    modalShow();

    modalContainer.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const form = e.target;
      // handler for additional services form
      if (form.id === 'cart-services__form') {
        const productId = Number(form.dataset.productId);
        // build array of selected services ids
        const selectedServices = [...form.querySelectorAll('input:checked')].map(checkbox =>
          Number(checkbox.dataset.serviceId),
        );
        // add selected services to cart (update record for a product)
        updateCartItemAdditionalServices(productId, selectedServices);
      }
      modalHide();
    });
  });
};

export const initCreditOptions = () => {
  document.querySelector('.cart-page__product-list').addEventListener('click', async e => {
    if (!e.target.classList.contains('cart-addinfo-btn--credit')) return;
    const productId = Number(e.target.dataset.id);
    const qty = Number(e.target.closest('li').querySelector('.product-page__item-amount').textContent);
    // ask 'backend' for credit options (includes all the product data)
    const creditOptions = await fetchCreditOptionsById(productId, qty);

    // create a credit payment option dictionary to make lookup by id easier
    // also need to calculate payment amount if there are more than 1 items - handlebars limitation, cannot multiply in the template
    let creditOptionsDict = {};
    creditOptions.forEach(option => {
      option.paymentOptions.forEach(po => {
        po.amount = po.payment * qty;

        creditOptionsDict[po.paymentOptionId] = {
          bankId: option.bankId,
          logo: option.logo,
          ...po,
        };
      });
    });

    // render and display modal window
    modalContainer.innerHTML = modalCreditTemplate(creditOptions);
    modalShow();

    // add listeners
    // when user selects a payment option -> update modal window with selected amount and num payments
    modalContainer.querySelectorAll('.credit-component__period-select').forEach(select => {
      select.addEventListener('change', e => {
        const select = e.target;
        // lookup selected credit option data by option id selected:
        const selectedCreditOption = creditOptionsDict[select.value];

        // update the modal dialog
        select.closest('.credit-component__item').querySelector('.credit-component__num-payments').textContent =
          selectedCreditOption.numPayments;
        select.closest('.credit-component__item').querySelector('.credit-component__payment-price').textContent =
          selectedCreditOption.payment * qty;
        select.closest('.credit-component__item').querySelector('.cart-addinfo-btn').dataset.paymentOptionId =
          selectedCreditOption.paymentOptionId;
      });
    });

    // when user confirms selection by clicking select button - update cartItem in cart and on page
    modalContainer.querySelectorAll('.cart-addinfo-btn').forEach(select => {
      select.addEventListener('click', e => {
        const btn = e.target;
        // lookup selected credit option data by option id selected.
        const selectedCreditOption = creditOptionsDict[btn.dataset.paymentOptionId];
        // update cart and page for a selected payment option
        updateCartItemCreditData(productId, selectedCreditOption);
        // close the modal dialog
        modalHide();
      });
    });
  });

  closeBtnModal.addEventListener('click', function () {
    modalHide();
  });
};



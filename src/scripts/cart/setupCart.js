import {
    getStorageItem,
    setStorageItem,
    formatPrice,
    getElement,
    getElements,
  } from '../utils'
  import { openCart } from './toggleCart';
  import { findProduct } from '../store.js';
  import renderCartItem from './renderCartItem';

    const cartUserMenuCount = getElement('.header__user-menu-count--cart');
    const cartList = getElement('.order__product-list');
    const cartOrderTotals = getElements('.order-summary__text--price');
    const cartOrderDelivery = getElements('.order-summary__text--delivery');
    const cartTotals = getElements('.order-summary__amount');

    let cart = getStorageItem('cart');

    export const addToCart = (id) => {
        let item = cart.find((cartItem) => cartItem.id === Number(id));
      
        if (!item) {
            let product = findProduct(id);
            
            // addToCart(parent.dataset.id);
        //   adding amount field to the item
             product = { ...product, amount: 1 };
         
        //   adding item to the cart
             cart = [...cart, product];
        //   render item to the DOM;
             renderCartItem(product);
        } else {
          // update values
          const amount = increaseAmount(id);
          //tranforming nodelist into array
          const items = [...cartList.querySelectorAll('.cart-item-amount')];
          //updating amount in DOM without page refreshing
          const newAmount = items.find((amountContainer) => amountContainer.dataset.id === id);
          newAmount.textContent = amount;
        }
        // adding numbers one to the items count in user-menu 
        renderCartItemCount();
        // render Cart Total
        renderCartTotal();

        // set cart in Local storage so that to get access to it in every page
        setStorageItem('cart', cart);
        
        openCart();
      };

      // render items count in user-menu 
      function renderCartItemCount() {
          const totalAmount = cart.reduce((acc, cartItem) => (
              acc+= cartItem.amount), 0);
            cartUserMenuCount.textContent = totalAmount;
        }

        // render Cart Total
        function renderCartTotal() {
        const total = cart.reduce((acc, {price, amount}) => (
                acc+= price * amount), 0);
        
        let delivery=0;
            if (total >0 && total <=1000) {delivery = 50;} else
            if (total > 1000 && total <=3000) {delivery = 25;}

              cartOrderTotals.forEach(el => el.textContent = formatPrice(total));
              cartOrderDelivery.forEach(el=>el.textContent = formatPrice(delivery));
              cartTotals.forEach(el=>el.textContent = 
                                    formatPrice(total + delivery));
          }

           // render all Cart items items from the Local Storage  
        function renderCart() {
            cart.forEach(cartItem => renderCartItem(cartItem))
        }

        // increasing cartItem in Local Storage
        function increaseAmount(id) {
            let newAmount;
            cart = cart.map((cartItem) => {
              if (cartItem.id === Number(id)) {
                newAmount = cartItem.amount + 1;
                cartItem = { ...cartItem, amount: newAmount };
              }
              return cartItem;
            });
            return newAmount;
        }

         // decreasing cartItem in Local Storage
         function decreaseAmount(id) {
            let newAmount;
            cart = cart.map((cartItem) => {
              if (cartItem.id === Number(id)) {
                newAmount = cartItem.amount - 1;
                cartItem = { ...cartItem, amount: newAmount };
              }
              return cartItem;
            });
            return newAmount;
        }

// removing cartItem from Local Storage
        function removeCartItem(id) {
            cart = cart.filter((cartItem) => cartItem.id !== Number(id));
          }

         function activateCartButtons() {
            cartList.addEventListener('click', (e) => {
                const parent = e.target.parentElement;
                const parentId = parent.dataset.id;

    // removing cartItem
    if (parent.classList.contains('order-card-remove-btn')) {
        removeCartItem(parentId);
        // parent.parentElement.remove();
        // removing cartItem from the DOM
        parent.parentElement.parentElement.remove();
      }
      // increasing cartItem
      if (parent.classList.contains('order-card-increase-btn')) {
        const newAmount = increaseAmount(parentId);
         // increasing cartItem in the DOM
        parent.previousElementSibling.textContent = newAmount;
      }

      // decreasing cartItem
      if (parent.classList.contains('order-card-decrease-btn')) {
        const newAmount = decreaseAmount(parentId);
        if (newAmount === 0) {
          removeCartItem(parentId);
          parent.parentElement.parentElement.remove();
        } else {
          parent.nextElementSibling.textContent = newAmount;
        }
      }

        renderCartItemCount();
        renderCartTotal();
        setStorageItem('cart', cart);
            })
         } 

      const start = () => {
        // render items count in user-menu 
        renderCartItemCount();
        // render Cart Total
        renderCartTotal();
        // render all Cart items items from the Local Storage
        renderCart();
        // activate Cart buttons
        activateCartButtons()
      }

      start();
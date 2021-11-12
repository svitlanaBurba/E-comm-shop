import { generateOrderId, getStorageItem, setStorageItem } from '../utils';

// returns open (not yet confirmed). if does not exists - creates a new open order and returns it
export const fetchOpenOrder = () => {
  const orders = getStorageItem('orders');
  let openOrder = orders.find(order => order.status === 'open');

  if (!openOrder) {
    openOrder = {
      id: generateOrderId(),
      status: 'open',
      deliveryData: {},
    };
    orders.push(openOrder);
    setStorageItem('orders', orders);
  }
  // order should always have deliveryData object (could be empty) so that we can safely work with it's properties
  if (!openOrder.deliveryData) openOrder.deliveryData = {};

  return openOrder;
};

export const saveOrder = orderToSave => {
  const orders = getStorageItem('orders');
  let orderIndex = orders.findIndex(order => order.id === orderToSave.id);
  if (orderIndex > -1) {
    orders[orderIndex] = orderToSave;
  } else {
    orders.push(orderToSave);
  }
  setStorageItem('orders', orders);
};

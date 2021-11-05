export const fetchOrder = () => {
  return JSON.parse(window.localStorage.getItem('order')) || {};
};

export const saveOrder = order => {
  window.localStorage.setItem('order', JSON.stringify(order));
};

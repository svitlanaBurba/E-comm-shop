import { fetchDeliveryCost } from "../api/fetchDeliveryCost";
import { formatPrice, getStoragePromoDiscount } from "../utils";

export const getCartTotals = cart => {
    const promoDiscount = getStoragePromoDiscount().discount || 0;
  
    const productsCost = cart.reduce((acc, { price, amount }) => (acc += price * amount), 0);
    const discount = promoDiscount !== 0 ? -1 * productsCost * promoDiscount : 0; // discount is negative!
    const servicesCost = cart.reduce((total, item) => total + (item.additionalServicesCost || 0), 0);
    const deliveryCost = fetchDeliveryCost(productsCost + discount + servicesCost);
    const total = productsCost + discount + servicesCost + deliveryCost; // discount is negative, so adding it
  
    return {
      productsCost: productsCost,
      discount: discount, 
      servicesCost: servicesCost,
      deliveryCost: deliveryCost,
      total: total,
      productsCostFormatted: formatPrice(productsCost),
      discountCostFormatted: formatPrice(discount), 
      servicesCostFormatted: formatPrice(servicesCost),
      deliveryCostFormatted: formatPrice(deliveryCost),
      totalCostFormatted: formatPrice(total), 
    }
  }
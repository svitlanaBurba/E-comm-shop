export const fetchDeliveryCost = (orderPrice) => {
    if (orderPrice > 0 && orderPrice <= 100) return 10;
    if (orderPrice > 100 && orderPrice <= 1000) return 5;
    return 0
}
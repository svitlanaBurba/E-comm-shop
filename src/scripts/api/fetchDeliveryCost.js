export const fetchDeliveryCost = (orderPrice) => {
    if (orderPrice > 0 && orderPrice <= 100) return 10;
    if (orderPrice > 100 && orderPrice <= 1000) return 5;
    return 0
}

export const fetchDetailedDeliveryCost = async (orderPrice, cart) => {
    let normalPrice = 10;
    const expressPriceRatio = 1.5;
    
    // calculate base price
    if (orderPrice > 0 && orderPrice <= 100) normalPrice = 10;
    if (orderPrice > 100 && orderPrice <= 1000) normalPrice = 5;
    // calculate express price
    let expressPrice = normalPrice * expressPriceRatio;

    return {
        expressDelivery: expressPrice,
        normalDelivery: normalPrice
    };
}

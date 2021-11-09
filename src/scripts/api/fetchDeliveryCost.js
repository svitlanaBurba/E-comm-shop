export const fetchDeliveryCost = (orderPrice) => {
    if (orderPrice > 0 && orderPrice <= 100) return 10;
    if (orderPrice > 100 && orderPrice <= 1000) return 5;
    return 0
}

export const fetchDetailedDeliveryCost = async (orderPrice, cart) => {
    let standardPrice = 10;
    const expressPriceRatio = 1.5;
    
    // calculate base price
    if (orderPrice > 0 && orderPrice <= 100) standardPrice = 10;
    if (orderPrice > 100 && orderPrice <= 1000) standardPrice = 5;
    // calculate express price
    let expressPrice = standardPrice * expressPriceRatio;
    // pickup price - always zero
    let pickupDelivery = orderPrice > 20 ? 0 : 1 ;

    // calculate delivery dates - vey simplified for now
    const today = new Date();
    let expressDate = (new Date(today)).setDate(today.getDate() + 1); // express is always tomorrow
    let standardDate = (new Date(today)).setDate(today.getDate() + 4); // standard is always 4 days
    let pickupDate = (new Date(today)).setDate(today.getDate() + 2); // pickup is always 2 days

    return {
        expressDelivery: expressPrice,
        standardDelivery: standardPrice,
        pickupDelivery: pickupDelivery,
        expressDeliveryDate: expressDate,
        standardDeliveryDate: standardDate,
        pickupDeliveryDate: pickupDate,
    };
}

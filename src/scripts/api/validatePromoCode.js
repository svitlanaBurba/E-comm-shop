const promocodes = {
    promo10: 0.1,
    promo20: 0.2,
    promo30: 0.3,
    joolie2020: 0.3,
};
  
export const validatePromoCode = (code) => {
    if (Object.keys(promocodes).includes(code)) {
        return {
            isValid: true,
            discount: promocodes[code]
        }
    }
    
    return {
        isValid: false,
        discount: 0
    }
        
}
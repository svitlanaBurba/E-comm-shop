import fetchProductById from './fetchProductById';

export const fetchCreditOptionsById = async (productId, qty) => {
    const product = await fetchProductById(productId);

  return calculateCreditOptions(product, qty);
};

const calculateCreditOptions = (product) => {
  const creditParams = [
    {
      bankId: 1,
      bankName: 'A-Bank. Pay in installments',
      logo: 'https://content.rozetka.com.ua/payments_methods/logo/original/195695785.png',
      paymentOptions: [
        { numMonths: 1, rate: 0.00 },
        { numMonths: 2, rate: 0.1 },
      ],
    },
    {
      bankId: 2,
      bankName: 'PrivatBank installment plan',
      logo: 'https://content2.rozetka.com.ua/payments_methods/logo/original/195705272.jpg',
      paymentOptions: [
        { numMonths: 1, rate: 0.00 },
        { numMonths: 2, rate: 0.05 },
        { numMonths: 3, rate: 0.1 },
      ],
    },
    {
      bankId: 3,
      bankName: 'Partial payments from MonoBank',
      logo: 'https://content2.rozetka.com.ua/payments_methods/logo/original/195705271.jpg',
      paymentOptions: [
        { numMonths: 1, rate: 0.05 },
        { numMonths: 2, rate: 0.05 },
        { numMonths: 3, rate: 0.05 },
        { numMonths: 4, rate: 0.05 },
        { numMonths: 5, rate: 0.05 },
        { numMonths: 6, rate: 0.05 },
      ],
    },
  ];

    let creditOptions = creditParams;
    
    creditOptions.forEach(option => {
      option.paymentOptions.forEach(paymentOption => {
        paymentOption.paymentOptionId = option.bankId + '_' + paymentOption.numMonths;
        paymentOption.numPayments = paymentOption.numMonths + 1;
        paymentOption.payment = calculateMonthlyPayment(product.price, paymentOption.numMonths, paymentOption.rate );
    });
  });
    
    return creditOptions;
};


const calculateMonthlyPayment = (amount, numMonths, annualRate) => {
    return Math.ceil((amount / (numMonths + 1) * (1 + annualRate / 12)) * 100) / 100;
}
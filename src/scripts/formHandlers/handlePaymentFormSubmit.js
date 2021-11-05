import { getElement } from "../utils"

const handlePaymentFormSubmit = e => {
    e.preventDefault();

    const formData = new FormData(e.target);
    console.log(formData);

    //transforming key-value pairs into an object
    const formObject = Object.fromEntries(formData.entries());

    //forming Json for form data object
    const formJson = JSON.stringify(formObject, null, 4);
    return formJson;
}

const setupPaymentFormSubmit = () => {
    const paymentForm = getElement('#payment-form');
    paymentForm.addEventListener("submit", handlePaymentFormSubmit);

}

export default setupPaymentFormSubmit;
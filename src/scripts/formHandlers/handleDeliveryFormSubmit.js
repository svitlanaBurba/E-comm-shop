import { getElement } from "../utils"

const handleDeliveryFormSubmit = e => {
    console.log('handleDeliveryFormSubmit');
    e.preventDefault();

    const formData = new FormData(e.target);

    //transforming key-value pairs into an object
    const formObject = Object.fromEntries(formData.entries());

    //adding array for checkbox
    formObject.checkboxDelivery = formData.getAll("checkboxDelivery");
    //forming Json for form data object
    const formJson = JSON.stringify(formObject, null, 4);
    console.log(formJson);
    return formJson;
}



export default handleDeliveryFormSubmit;
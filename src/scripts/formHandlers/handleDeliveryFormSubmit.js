import { getElement } from "../utils"

const handleDeliveryFormSubmit = e => {
    const formData = new FormData(e.target);

    //transforming key-value pairs into an object
    const formObject = Object.fromEntries(formData.entries());

    //adding array for checkbox
    formObject.checkboxDelivery = formData.getAll("checkboxDelivery");
    //forming Json for form data object
    const formJson = JSON.stringify(formObject, null, 4);
    return formJson;
}



export default handleDeliveryFormSubmit;
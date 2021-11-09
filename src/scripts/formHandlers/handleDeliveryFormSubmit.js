

const handleDeliveryFormSubmit = form => {
    const formData = new FormData(form);

    //transforming key-value pairs into an object
    const formObject = Object.fromEntries(formData.entries());

    //adding array for checkbox
    formObject.checkboxDelivery = formData.getAll("checkboxDelivery");

    return formObject;
}



export default handleDeliveryFormSubmit;
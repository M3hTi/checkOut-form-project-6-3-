const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
];

const checkOutForm = document.querySelector('.checkout-form');
const errorBox = document.querySelector('.error-box');
const sameAsShippingCheckbox = document.querySelector('input[name="same_as_shipping"]');



// Field pairs to validate and sync
const fieldPairs = [
    { class: 'js-fname', error: 'first name', name: 'first_name' },
    { class: 'js-lname', error: 'last name', name: 'last_name' },
    { class: 'js-address', error: 'address', name: 'address1' },
    { class: 'js-city', error: 'city', name: 'city' },
    { class: 'js-lists', error: 'state', name: 'state' },
    { class: 'js-country', error: 'country', name: 'country' },
    { class: 'js-postal', error: 'postal code', name: 'postal', 
      validatePattern: true } // Added flag for postal validation
];

function showError(message) {
    errorBox.style.display = 'block';
    errorBox.textContent = message;
    return true;
}

function validateField(shippingField, billingField, errorMessage, validatePattern = false) {
    // Check for empty fields
    if (shippingField.validity.valueMissing || billingField.validity.valueMissing) {
        return showError(`Please enter your ${errorMessage}`);
    }
    
    // Check pattern for postal code
    if (validatePattern && (shippingField.validity.patternMismatch || billingField.validity.patternMismatch)) {
        return showError(`Please enter a valid ${errorMessage} in format: 12345 or 12345-6789`);
    }
    
    // Check if fields match
    if (shippingField.value !== billingField.value) {
        return showError(`${errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1)} in shipping and billing must match`);
    }
    
    return false;
}

function copyShippingToBilling() {
    fieldPairs.forEach(field => {
        const shippingField = document.querySelector(`[name="shipping_${field.name}"]`);
        const billingField = document.querySelector(`[name="billing_${field.name}"]`);
        billingField.value = shippingField.value;
    });
}

function submitForm(evt) {
    evt.preventDefault();
    errorBox.style.display = 'none';
    errorBox.textContent = '';
    
    let hasError = false;
    
    for (const field of fieldPairs) {
        const shippingField = checkOutForm.querySelector(`[name="shipping_${field.name}"]`);
        const billingField = checkOutForm.querySelector(`[name="billing_${field.name}"]`);
        
        hasError = validateField(shippingField, billingField, field.error, field.validatePattern);
        if (hasError) break;
    }

    if (!hasError) {
        console.log('Form is valid, submitting...');
    }
}

// Initialize state dropdowns
window.addEventListener('load', () => {
    const stateOptions = states.map(state => 
        `<option value="${state}">${state}</option>`
    ).join('');
    
    document.querySelectorAll('select').forEach(select => {
        select.insertAdjacentHTML('beforeend', stateOptions);
    });
});

// Event Listeners
checkOutForm.addEventListener('submit', submitForm);
sameAsShippingCheckbox.addEventListener('change', (e) => {
    if (e.target.checked) {
        copyShippingToBilling();
    }
});
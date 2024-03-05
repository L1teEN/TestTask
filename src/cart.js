document.addEventListener('DOMContentLoaded', () => {
    getInfo();
});

let userContainer = document.getElementById('user-info-container');
let cartContainer = document.getElementById('shopping-cart-container');

async function getInfo() {

    const sumElement = document.getElementById('sum');
    if (!sumElement) {
        console.error("Sum element not found");
        return;
    }
    if (!cartContainer) {
        console.error("Cart container not found");
        return;
    }

    const response = await fetch('./src/medicineList.json');
    const data = await response.json();

    if (localStorage.length !== 0) {
        cartContainer.innerHTML = '';
    }

    data.medicines.forEach(medicine => {
        const localStorageKey = `${medicine.title}`;
        const localStorageValue = localStorage.getItem(localStorageKey);

        if (localStorageValue !== null) {
            const medicineElement = createMedicineElement(medicine, localStorageValue);
            cartContainer.appendChild(medicineElement);
        } else {
            console.log(`Not found in localStorage: ${localStorageKey}`);
        }
    });

    calcTotalPrice();

    userContainer.innerHTML = `
        <h1>User Information</h1>
        <form>
            <input type="text" placeholder="Name" id="user_name">
            <input type="text" placeholder="Email" id="user_email">
            <input type="text" placeholder="Phone" id="user_phone">
            <input type="text" placeholder="Address" id="user_address">
        </form>
    `;
}

function createMedicineElement(medicine, localStorageValue) {
    let medicineElement = document.createElement('div');
    medicineElement.className = 'medicine-item';
    medicineElement.style.marginBottom = '25px';
    let drugImage = document.createElement('img');
    drugImage.width = 120;
    drugImage.height = 120;
    let drugTitle = document.createElement('h2');
    let drugPrice = document.createElement('p');
    drugPrice.className = 'drug-price';
    let quantityInput = document.createElement('input');
    let removeButton = document.createElement('button')
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';
    removeButton.onclick = () => removeItem(medicineElement, removeButton, medicine, cartContainer);

    drugImage.src = medicine.image;
    drugTitle.textContent = medicine.title;

    const price = parsePrice(localStorageValue);
    console.log(`Parsed Price: ${price}`);
    const purchaseButton = document.getElementById('purchase-button')

    purchaseButton.onclick = () => purchaseItems(cartContainer, medicine, medicineElement)

    if (!isNaN(price)) {
        drugPrice.textContent = `£${price.toFixed(2)}`;
        quantityInput.type = 'number';
        quantityInput.value = '1';
        quantityInput.addEventListener('input', () => updateTotalPrice(medicine, quantityInput, drugPrice, price));
    } else {
        drugPrice.textContent = 'Price not available';
    }

    medicineElement.appendChild(drugImage);
    medicineElement.appendChild(drugTitle);
    medicineElement.appendChild(drugPrice);
    medicineElement.appendChild(quantityInput);
    medicineElement.appendChild(removeButton);

    return medicineElement;
}

function parsePrice(value) {
    return parseFloat(value.replace(/[^\d.]/g, ''));
}

function updateTotalPrice(medicine, quantityInput, totalPriceElement, unitPrice) {
    let quantity = parseInt(quantityInput.value, 10);

    if (quantity < 1) {
        alert("Quantity cannot be less than 1. Setting quantity to 1.");
        quantity = 1;
        quantityInput.value = 1;
    }

    let totalPrice = quantity * unitPrice;
    totalPriceElement.textContent = `Total: £${totalPrice.toFixed(2)}`;

    calcTotalPrice();
}

const img = document.createElement('img');
const heading = document.createElement('h1');
heading.textContent = 'Shopping Cart'
img.src = 'https://static.thenounproject.com/png/3592882-200.png';
img.className = 'cart-img';

function removeItem(medicineElement, removeButton, medicine, cartContainer) {
    medicineElement.innerHTML = '';
    cartContainer.removeChild(medicineElement);
    localStorage.removeItem(medicine.title);

    if(!cartContainer.hasChildNodes()) {
        cartContainer.appendChild(heading);
        cartContainer.appendChild(img);
    }

    setTimeout(() => {
        calcTotalPrice(); // Call calcTotalPrice after a short delay
    }, 0);
}

let total = 0; // Add this global variable

function calcTotalPrice() {
    total = 0;

    const sumElement = document.getElementById('sum');
    if (!sumElement) {
        console.error("Sum element not found");
        return;
    }

    const medicineElements = cartContainer.querySelectorAll('.medicine-item');

    for (let i = 0; i < medicineElements.length; i++) {
        const medicineElement = medicineElements[i];

        const priceElement = medicineElement.querySelector('.drug-price');
        if (priceElement) {
            const priceText = priceElement.textContent.replace(/[^\d.]/g, ''); // Remove non-numeric characters
            const price = parseFloat(priceText);

            if (!isNaN(price)) {
                total += price;
            }
        }
    }

    sumElement.textContent = `Total Price: £${total.toFixed(2)}`;
}

function purchaseItems(cartContainer) {
    const userName = document.getElementById('user_name');
    const userEmail = document.getElementById('user_email');
    const userPhone = document.getElementById('user_phone');
    const userAddress = document.getElementById('user_address')

    if (total > 0 && userName.value !== '' && userEmail.value !== '' && userPhone.value !== '' && userAddress.value !== '') {
        alert(`Items purchased successfully! Total Price: £${total.toFixed(2)}`);

        // Clear the cart content and local storage
        cartContainer.innerHTML = '';
        localStorage.clear();

        if (!cartContainer.hasChildNodes()) {
            cartContainer.appendChild(heading);
            cartContainer.appendChild(img);
        }

        total = 0;
        userName.value = '';
        userEmail.value = '';
        userPhone.value = '';
        userAddress.value = '';
        const sumElement = document.getElementById('sum');
        sumElement.textContent = `Total Price: £${total.toFixed(2)}`;
    } else {
        alert('You provided wrong information or your cart is empty!');
    }
}
document.addEventListener('DOMContentLoaded', () => {
    buildCatalog();
});

async function buildCatalog() {
    const drugsList = document.getElementById('drugs-list');

    if (!drugsList) {
        console.error("Catalog container not found");
        return;
    }

    const response = await fetch('./src/medicineList.json');
    const data = await response.json();

    data.medicines.forEach(medicine => {
        const medicineElement = createMedicineElement(medicine);
        drugsList.appendChild(medicineElement);
    });
}


function createMedicineElement(medicine) {
    const medicineContainer = document.createElement('div');

    const title = document.createElement('h3');
    const price = document.createElement('p')
    const image = document.createElement('img');
    medicineContainer.className = 'medicine-container'

    const medicineElement = document.createElement('div');
    medicineElement.className = 'medicine-element'
    medicineContainer.appendChild(medicineElement)
    const priceAndButton = document.createElement('div');
    priceAndButton.className = 'price-and-button'

    const addToCartBtn = document.createElement('button');
    addToCartBtn.className = 'add-to-cart-button'
    addToCartBtn.textContent = 'Add to cart';

    image.src = medicine.image;
    image.width = 120;
    image.height = 120;
    title.textContent = medicine.title;
    price.textContent = '£' + medicine.price;
    price.style.fontWeight = 'bold';

    addToCartBtn.onclick = () => showAlert(medicineElement, title, price);

    medicineElement.appendChild(image);
    medicineElement.appendChild(title);
    medicineElement.appendChild(priceAndButton);
    priceAndButton.appendChild(price);
    priceAndButton.appendChild(addToCartBtn);

    sortItems();


    return medicineElement;
}

function showAlert(medicineElement, title, price) {
    const alertMessage = document.createElement('div');
    alertMessage.className = 'alert active';
    const alertTitle = document.createElement('h3');
    alertTitle.textContent = 'Added to cart!';
    alertTitle.style.textAlign = 'center';
    alertMessage.appendChild(alertTitle);
    medicineElement.appendChild(alertMessage);
    storeItem(title, price)


    console.log(alertMessage.className);
    if (alertMessage.className === 'alert active') {
        setTimeout(removeAlert, 2000);

        function removeAlert() {
            alertMessage.className = 'alert';
        }
    }
}

function storeItem(title, price) {
    localStorage.setItem(title.textContent, price.textContent);
}

function sortItems(medicineElement, medicine) {
    const drugsList = document.getElementById('drugs-list');

    const selectItem = document.getElementById('select-list');
    selectItem.addEventListener('change', () => {
        const medicines = [];

        drugsList.childNodes.forEach((child) => {
            if (child.nodeType === 1) {
                medicines.push(child);
            }
        });

        medicines.sort((a, b) => {
            const priceA = parseFloat(a.querySelector('.price-and-button p').textContent.slice(1).replace(',', ''));
            const priceB = parseFloat(b.querySelector('.price-and-button p').textContent.slice(1).replace(',', ''));

            if (selectItem.value === 'lower') {
                return priceA - priceB;
            } else if (selectItem.value === 'higher') {
                return priceB - priceA;
            }
        });

        medicines.forEach(medicine => drugsList.removeChild(medicine));
        medicines.forEach(medicine => drugsList.appendChild(medicine));
    });
}
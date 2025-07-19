async function uploadImage(type) {
    const inputId = type === 'name' ? 'imageInputName' : 'imageInputDate';
    const outputId = type === 'name' ? 'productName' : 'productExpiryDate';

    const imageInput = document.getElementById(inputId);
    if (!imageInput.files.length) {
        alert('Please select an image!');
        return;
    }

    const formData = new FormData();
    formData.append('image', imageInput.files[0]);

    try {
        const response = await fetch('http://localhost:5000/api/scan', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById(outputId).value = type === 'name' ? result.scannedData.name : result.scannedData.expirationDate;
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to scan image.');
    }
}

async function confirmProduct() {
    const productName = document.getElementById('confirmProductName').value;
    const expirationDate = document.getElementById('confirmExpiryDate').value;

    if (!productName || !expirationDate) {
        alert('Please confirm product details before saving.');
        return;
    }

    const productData = { name: productName, expirationDate };

    try {
        const response = await fetch('http://localhost:5000/api/confirm', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Product saved successfully!');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to save product.');
    }
}

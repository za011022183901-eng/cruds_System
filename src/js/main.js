// ================= Selectors =================
const titleInput = document.getElementById("tttle");
const priceInput = document.getElementById("price");
const taxesInput = document.getElementById("taxes");
const adsInput = document.getElementById("ads");
const discountInput = document.getElementById("discount");
const totalElement = document.getElementById("total");
const countInput = document.getElementById("count");
const categoryInput = document.getElementById("category");
const supmitBtn = document.getElementById("supmit");
const tbody = document.getElementById("tbody");
const deleteALLBtn = document.getElementById("deleteALL");

// ================= State Management =================
let mode = "create";
let tempIndex;
let productList = JSON.parse(localStorage.getItem("product")) || [];

// ================= Validation Logic =================
const formAlert = document.createElement("div");
formAlert.id = "formAlert";
supmitBtn.parentNode.insertBefore(formAlert, supmitBtn);

function isValidText(text) {
    // يسمح بالحروف العربية والإنجليزية، يرفض أن يكون النص أرقاماً فقط أو فارغاً
    const regex = /[a-zA-Z\u0621-\u064A]+/;
    return regex.test(text.trim());
}

function validateInputs() {
    formAlert.innerHTML = "";
    
    if (!isValidText(titleInput.value)) {
        showError("Title must contain letters and cannot be empty.");
        return false;
    }
    if (priceInput.value === "" || +priceInput.value < 0) {
        showError("Price must be a positive number.");
        return false;
    }
    if (!isValidText(categoryInput.value)) {
        showError("Category must contain letters and cannot be empty.");
        return false;
    }
    if (totalElement.innerHTML === "" || totalElement.innerHTML === "NaN") {
        showError("Please calculate a valid total.");
        return false;
    }
    return true;
}

function showError(msg) {
    formAlert.innerHTML = `<div class="alert alert-danger p-2 text-center">${msg}</div>`;
}

// ================= CRUD Operations =================
function getTotal() {
    if (priceInput.value !== '') {
        let result = (+priceInput.value + +taxesInput.value + +adsInput.value) - +discountInput.value;
        totalElement.innerHTML = result;
        totalElement.style.background = "#28a745";
    } else {
        totalElement.innerHTML = '';
        totalElement.style.background = "#dc3545";
    }
}

supmitBtn.onclick = function() {
    if (!validateInputs()) return;

    let newPro = {
        title: titleInput.value.trim(),
        price: priceInput.value,
        taxes: taxesInput.value,
        ads: adsInput.value,
        discount: discountInput.value,
        total: totalElement.innerHTML,
        category: categoryInput.value.trim()
    };

    if (mode === "create") {
        let count = parseInt(countInput.value) > 1 ? parseInt(countInput.value) : 1;
        for (let i = 0; i < count; i++) productList.push(newPro);
    } else {
        productList[tempIndex] = newPro;
        resetFormUI();
    }

    localStorage.setItem("product", JSON.stringify(productList));
    clearInputs();
    showData();
};

function showData() {
    let tableRows = "";
    productList.forEach((pro, i) => {
        tableRows += `
        <tr>
            <td>${i + 1}</td>
            <td>${pro.title}</td>
            <td>${pro.price}</td>
            <td>${pro.taxes}</td>
            <td>${pro.ads}</td>
            <td>${pro.discount}</td>
            <td>${pro.total}</td>
            <td>${pro.category}</td>
            <td><button class="btn btn-warning btn-sm" onclick="editData(${i})">Update</button></td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteData(${i})">Delete</button></td>
        </tr>`;
    });
    tbody.innerHTML = tableRows;
    deleteALLBtn.innerHTML = productList.length > 0 ? 
        `<button class="btn btn-dark w-100 mb-3" onclick="deleteAll()">Delete All (${productList.length})</button>` : "";
}

function deleteData(i) {
    productList.splice(i, 1);
    localStorage.setItem("product", JSON.stringify(productList));
    showData();
}

function deleteAll() {
    localStorage.clear();
    productList = [];
    showData();
}

function editData(i) {
    let p = productList[i];
    titleInput.value = p.title;
    priceInput.value = p.price;
    taxesInput.value = p.taxes;
    adsInput.value = p.ads;
    discountInput.value = p.discount;
    categoryInput.value = p.category;
    getTotal();
    
    countInput.style.display = "none";
    supmitBtn.innerHTML = "Update Product";
    supmitBtn.style.background = "#ffc107";
    mode = "update";
    tempIndex = i;
    window.scrollTo({top: 0, behavior: 'smooth'});
}

// ================= Utilities =================
function clearInputs() {
    titleInput.value = "";
    priceInput.value = "";
    taxesInput.value = "";
    adsInput.value = "";
    discountInput.value = "";
    totalElement.innerHTML = "";
    countInput.value = "";
    categoryInput.value = "";
    totalElement.style.background = "#dc3545";
}

function resetFormUI() {
    mode = "create";
    supmitBtn.innerHTML = "Create Product";
    supmitBtn.style.background = "#007bff";
    countInput.style.display = "block";
}

// Initial Call
showData();
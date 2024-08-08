function toggleIcon(element) {
    const triangle = element.querySelector('.triangle');
    const collapseElement = document.getElementById(element.getAttribute('aria-controls'));
    const container = collapseElement.closest('.converter-container');

    if (collapseElement.classList.contains('show')) {
        triangle.innerHTML = '&#9654;'; // Right-pointing triangle
        container.classList.add('collapsed');
    } else {
        triangle.innerHTML = '&#9660;'; // Down-pointing triangle
        container.classList.remove('collapsed');
    }
}

calculateCadPrice();
showPage('calculator'); 

function showPage(page) {
    document.querySelectorAll('.container, .converter-container, .car-calculator-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(page).style.display = 'flex';
}

function formatNumber(num) {
    return "$ " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatNumberNoSymbol(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function parseFormattedNumber(str) {
    return parseFloat(str.replace(/[^0-9.-]+/g,""));
}

function formatAndCalculate(id) {
    let input = document.getElementById(id);
    let value = parseFormattedNumber(input.value);
    input.value = formatNumber(value);
    calculateCadPrice();
}

function formatAndCalculateCar(id) {
    let input = document.getElementById(id);
    let value = parseFormattedNumber(input.value);
    input.value = formatNumber(value);
    calculateUsdSellingPrice();
}

function calculateCadPrice() {
    const usdPrice = parseFormattedNumber(document.getElementById('usdPrice').value) || 0;
    const exchangeRate = parseFloat(document.getElementById('exchangeRate').value) || 0;
    const expenses = parseFormattedNumber(document.getElementById('expenses').value) || 0;
    const profit = parseFormattedNumber(document.getElementById('profit').value) || 0;
    const cadPrice = Math.ceil((usdPrice * exchangeRate) - (expenses + profit));
    document.getElementById('cadPrice').value = formatNumber(cadPrice);
}

function calculateUsdSellingPrice() {
    const cadBoughtPrice = parseFormattedNumber(document.getElementById('cadBoughtPrice').value) || 0;
    const Expenses2 = parseFormattedNumber(document.getElementById('Expenses2').value) || 0;
    const desiredProfit = parseFormattedNumber(document.getElementById('desiredProfit').value) || 0;
    const fxRate = parseFloat(document.getElementById('fxRate').value) || 0;
    const usdSellingPrice = Math.ceil((cadBoughtPrice + Expenses2 +desiredProfit) / fxRate);
    document.getElementById('usdSellingPrice').value = formatNumber(usdSellingPrice);
}

function incrementInput(id, increment) {
    let input = document.getElementById(id);
    let value;
    if (input.type === 'text') {
        value = parseFormattedNumber(input.value) || 0;
    } else {
        value = parseFloat(input.value) || 0;
    }
    value += increment;
    if (input.type === 'text') {
        input.value = formatNumber(value);
    } else {
        input.value = value.toFixed(2);
    }
    calculateCadPrice();
}

function incrementCarInput(id, increment) {
    let input = document.getElementById(id);
    let value;
    if (input.type === 'text') {
        value = parseFormattedNumber(input.value) || 0;
    } else {
        value = parseFloat(input.value) || 0;
    }
    value += increment;
    if (input.type === 'text') {
        input.value = formatNumber(value);
    } else {
        input.value = value.toFixed(2);
    }
    calculateUsdSellingPrice();
}

function resetForm() {
    document.getElementById('vin').value = '';
    document.getElementById('usdPrice').value = '$ 0';
    document.getElementById('exchangeRate').value = '1.36';
    document.getElementById('expenses').value = '$ 6 000';
    document.getElementById('profit').value = '$ 0';
    document.getElementById('cadPrice').value = '';
}

function resetCarForm() {
    document.getElementById('cadBoughtPrice').value = '$ 0';
    document.getElementById('desiredProfit').value = '$ 0';
    document.getElementById('Expenses2').value = '$ 0';
    document.getElementById('fxRate').value = '1.36';
    document.getElementById('usdSellingPrice').value = '';
}

function saveEntry() {
    const vin = document.getElementById('vin').value;
    const usdPrice = document.getElementById('usdPrice').value;
    const cadPrice = document.getElementById('cadPrice').value;

    if (vin.length < 6) {
        alert('VIN must be at least 6 characters long.');
        return;
    }

    const last6Vin = vin.slice(-7);

    const table = document.getElementById('entriesTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow(0);  // Insert new row at the top

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);

    cell1.innerHTML = last6Vin;
    cell2.innerHTML = usdPrice;
    cell3.innerHTML = cadPrice;

    if (table.rows.length > 6) {
        table.deleteRow(6);
    }
}

function convertKmToMiles() {
    const kmInput = document.getElementById('kmInput');
    let km = kmInput.value.replace(/\s+/g, '');
    if (km === '') return;
    km = parseInt(km.replace(/[^0-9]/g, ''), 10);
    if (km > 999999) {
        km = 999999;
    }
    kmInput.value = formatNumberNoSymbol(km);
    const miles = km * 0.621371;
    document.getElementById('milesOutput').innerText = "Miles: " + formatNumberNoSymbol(miles.toFixed(0));
}

function incrementKm(amount) {
    const kmInput = document.getElementById('kmInput');
    let km = kmInput.value.replace(/\s+/g, '');
    km = parseInt(km.replace(/[^0-9]/g, ''), 10) || 0;
    km += amount;
    if (km > 999999) {
        km = 999999;
    } else if (km < 0) {
        km = 0;
    }
    kmInput.value = formatNumberNoSymbol(km);
    convertKmToMiles();
}

function convertKgToLbs() {
    const KgInput = document.getElementById('KgInput');
    let Kg = KgInput.value.replace(/\s+/g, '');
    if (Kg === '') return;
    Kg = parseInt(Kg.replace(/[^0-9]/g, ''), 10);
    if (Kg > 999999) {
        Kg = 999999;
    }
    KgInput.value = formatNumberNoSymbol(Kg);
    const lbs = Kg * 2.205;
    document.getElementById('LBSOutput').innerText = "Pounds: " + formatNumberNoSymbol(lbs.toFixed(0));
}

function incrementKg(amount) {
    const KgInput = document.getElementById('KgInput');
    let Kg = KgInput.value.replace(/\s+/g, '');
    Kg = parseInt(Kg.replace(/[^0-9]/g, ''), 10) || 0;
    Kg += amount;
    if (Kg > 999999) {
        Kg = 999999;
    } else if (Kg < 0) {
        Kg = 0;
    }
    KgInput.value = formatNumberNoSymbol(Kg);
    convertKgToLbs();
}

function formatVin() {
    const vinInput = document.getElementById('vin');
    let vinValue = vinInput.value.replace(/\s+/g, ''); // Remove all spaces
    if (vinValue.length > 3) {
        vinValue = vinValue.slice(0, 3) + ' ' + vinValue.slice(3); // Add space after 3 characters
    }
    vinInput.value = vinValue;
}

function isNumberKey(evt) {
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}

function copyTableToClipboard() {
    let table = document.querySelector('.last-entries table');
    let range = document.createRange();
    range.selectNode(table);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
    window.getSelection().removeAllRanges();
    alert('Table copied to clipboard');
}

function toggleMenu(clickedMenuId) {
    const checkboxes = document.querySelectorAll('nav input[type="checkbox"]');

    checkboxes.forEach(checkbox => {
        if (checkbox.id !== clickedMenuId) {
            checkbox.checked = false;
        }
    });

    const clickedCheckbox = document.getElementById(clickedMenuId);
    const menu = document.getElementById('menu');

    if (clickedCheckbox.checked) {
        menu.style.borderBottomRightRadius = '15px';
        menu.style.borderBottomLeftRadius = '15px';
    } else {
        menu.style.borderRadius = '15px';
    }
}

document.addEventListener('click', function(event) {
    const menu = document.getElementById('menu');
    const checkboxes = document.querySelectorAll('nav input[type="checkbox"]');

    if (!menu.contains(event.target)) {
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                checkbox.checked = false;
                menu.style.borderRadius = '15px';
            }
        });
    }
});

function showPage(page) {
    document.querySelectorAll('.container, .converter-container, .car-calculator-container').forEach(container => {
        container.style.display = 'none';
    });
    document.getElementById(page).style.display = 'flex';
    document.getElementById('responsive-menu').checked = false;
    const menu = document.getElementById('menu');
    menu.style.borderRadius = '15px';
}

function toggleIcon(element) {
    const triangle = element.querySelector('.triangle');
    const collapseElement = document.getElementById(element.getAttribute('aria-controls'));
    const container = collapseElement.closest('.converter-container');

    if (collapseElement.classList.contains('show')) {
        triangle.innerHTML = '&#9654;'; // Right-pointing triangle
        container.classList.add('collapsed');
    } else {
        triangle.innerHTML = '&#9660;'; // Down-pointing triangle
        container.classList.remove('collapsed');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.converter-container').forEach(container => {
        container.classList.add('initial');
    });
});

var collapseElementList = [].slice.call(document.querySelectorAll('.collapse'))
var collapseList = collapseElementList.map(function (collapseEl) {
  return new bootstrap.Collapse(collapseEl, {
    toggle: false
  })
})

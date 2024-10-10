function formatNumber(num) {
    return `$ ${num.toLocaleString()}`;
}

function parseFormattedNumber(str) {
    return parseFloat(str.replace(/[^0-9.-]+/g, ""));
}

function calculateCADBuyingPrice() {
    const usdPrice = parseFormattedNumber(document.getElementById('usdPrice').value) || 0;
    const exchangeRate = parseFloat(document.getElementById('fxRate').value) || 1;
    const expenses = parseFormattedNumber(document.getElementById('expenses').value) || 0;
    const cadPrice = Math.ceil((usdPrice * exchangeRate) - expenses);
    document.getElementById('cadBuyingPrice').value = formatNumber(cadPrice);
}

function resetCADCalculator() {
    document.getElementById('vin').value = '';
    document.getElementById('usdPrice').value = '';
    document.getElementById('fxRate').value = '1.33';
    document.getElementById('expenses').value = '7500';
    document.getElementById('cadBuyingPrice').value = '';
}

function convertKgToPounds() {
    const kg = parseFloat(document.getElementById('kg').value);
    if (isNaN(kg)) {
        document.getElementById('pounds').value = 'Invalid input';
        return;
    }
    const pounds = kg * 2.20462;
    document.getElementById('pounds').value = pounds.toFixed(0);
}

function convertKmToMiles() {
    const km = parseFloat(document.getElementById('km').value);
    if (isNaN(km)) {
        document.getElementById('miles').value = 'Invalid input';
        return;
    }
    const miles = km * 0.621371; 
    document.getElementById('miles').value = miles.toFixed(0);
}

// Add event listeners to input fields
document.getElementById('kg').addEventListener('input', convertKgToPounds);
document.getElementById('km').addEventListener('input', convertKmToMiles);

function resetKm() {
    document.getElementById('km').value = '';
    document.getElementById('miles').value = '';
}

function copyMiles() {
    const milesValue = document.getElementById('miles').value;
    navigator.clipboard.writeText(milesValue);
    alert('Miles copied to clipboard!');
}

function copyCAD() {
    const cadPrice = document.getElementById('cadBuyingPrice').value;
    navigator.clipboard.writeText(cadPrice);
    alert('Copied');
}

function resetKg() {
    document.getElementById('kg').value = '';
    document.getElementById('pounds').value = '';
}

function copyPounds() {
    const poundsValue = document.getElementById('pounds').value;
    navigator.clipboard.writeText(poundsValue);
    alert('Pounds copied to clipboard!');
}

function calculateUSDSellingPrice() {
    const cadBoughtPrice = parseFormattedNumber(document.getElementById('cadBoughtPrice').value) || 0;
    const expenses2 = parseFormattedNumber(document.getElementById('expenses2').value) || 0;
    const desiredProfit = parseFormattedNumber(document.getElementById('desiredProfit').value) || 0;
    const fxRate = parseFloat(document.getElementById('fxRate2').value) || 0;
    const usdSellingPrice = Math.ceil((cadBoughtPrice - expenses2 - desiredProfit) / fxRate);
    document.getElementById('usdSellingPrice').value = formatNumber(usdSellingPrice);
}

function resetUSDCalculator() {
    document.getElementById('cadBoughtPrice').value = '';
    document.getElementById('desiredProfit').value = '';
    document.getElementById('expenses2').value = '7500';
    document.getElementById('fxRate2').value = '1.33';
    document.getElementById('usdSellingPrice').value = '';
}

function toggleCalculator(type) {
    const cadCalc = document.getElementById('cadCalculator');
    const usdCalc = document.getElementById('usdCalculator');
    const menu = document.getElementById('calculatorOptions');
    const menuToggle = document.getElementById('menuToggle');
    const cadOption = document.querySelector('.calculator-option:nth-child(1)');
    const usdOption = document.querySelector('.calculator-option:nth-child(2)');

    if (type === 'cad') {
        cadCalc.style.display = 'block';
        usdCalc.style.display = 'none';
        cadOption.classList.add('active');
        usdOption.classList.remove('active');
        menuToggle.classList.toggle('open');

        setTimeout(() => {
            menu.classList.remove('show');
        }, 300);


    } else {
        cadCalc.style.display = 'none';
        usdCalc.style.display = 'block';
        cadOption.classList.remove('active');
        usdOption.classList.add('active');
        menuToggle.classList.toggle('open');

        setTimeout(() => {
            menu.classList.remove('show');
        }, 300);

    }
}
// Menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const calculatorOptions = document.getElementById('calculatorOptions');

menuToggle.addEventListener('click', function(e) {
    e.preventDefault();
    this.classList.toggle('open');
    calculatorOptions.classList.toggle('show');
    
});

// Initialize the calculators
resetCADCalculator();
resetUSDCalculator();

function changeValue(inputId, increment) {
    const input = document.getElementById(inputId);
    const value = parseInt(input.value, 10) || 0; // Ensure it's a number
    const newValue = value + increment;
    input.value = newValue; // Update the input value
    input.dispatchEvent(new Event('input')); // Trigger the oninput event to recalculate
}

function changeValueFX(inputId, increment) {
    const input = document.getElementById(inputId);
    const value = parseFloat(input.value) || 0; // Use parseFloat for decimals
    const newValue = (value + increment).toFixed(2); // Ensure precision and set it to 3 decimal places
    input.value = newValue; // Update the input value
    input.dispatchEvent(new Event('input')); // Trigger the oninput event to recalculate
}

// State to hold the last known exchange rate and update time
let lastKnownRate = null;
let lastUpdateTime = null;

// On page load, check if the data is stored in localStorage
document.addEventListener("DOMContentLoaded", function() {
    if (localStorage.getItem("lastKnownRate")) {
        lastKnownRate = localStorage.getItem("lastKnownRate");
        lastUpdateTime = localStorage.getItem("lastUpdateTime");
        
        // Update the button and modal to show the last known rate and time
        displayRateButtonText();
        displayRateInModal();
    } else {
        // If there's no data, show "Show Rate"
        displayRateButtonText();
    }
});

// Fetch exchange rate and update the button and modal text
function fetchExchangeRate() {
    fetch("https://api.currencyapi.com/v3/latest?apikey=cur_live_DXqFq3Wu4A35zMecpFgAl6qkDVtjdWuaE3QTBZiW&currencies=USD,CAD")
        .then(response => response.json())
        .then(data => {
            const cadToUsdRate = data.data['CAD'].value / data.data['USD'].value;
            lastKnownRate = cadToUsdRate.toFixed(4); // Store the rate
            lastUpdateTime = new Date().toLocaleString(); // Store the current time

            // Store the data in localStorage
            localStorage.setItem("lastKnownRate", lastKnownRate);
            localStorage.setItem("lastUpdateTime", lastUpdateTime);

            // Update the button and modal with the new rate and time
            displayRateButtonText();
            displayRateInModal();
        })
        .catch(error => {
            console.error('Error fetching exchange rate:', error);
            document.getElementById("rateDisplay").textContent = "Error fetching rate.";
            document.getElementById("lastUpdated").textContent = `Last updated: N/A`;
        });
}

// Set the button text to "Show Rate" when no rate is available
function displayRateButtonText() {
    if (lastKnownRate === null) {
        document.getElementById("fetchRateButton").innerHTML = "Show Rate";
    } else {
        document.getElementById("fetchRateButton").innerHTML = `1 USD = ${lastKnownRate} CAD`;
    }
}

// Display the rate and last update time in the modal
function displayRateInModal() {
    if (lastKnownRate !== null && lastUpdateTime !== null) {
        document.getElementById("rateDisplay").textContent = `1 USD = ${lastKnownRate} CAD`;
        document.getElementById("lastUpdated").textContent = `Last updated: ${lastUpdateTime}`;
    }
}

// Event listener for the fetchRateButton to display the last known rate or show modal
document.getElementById("fetchRateButton").addEventListener("click", function () {
    openModal(); // Open the modal
});

// Event listener for "Update" button in modal
document.getElementById("updateRateButton").addEventListener("click", function () {
    fetchExchangeRate(); // Fetch the latest rate and update the modal content
});

// Function to open modal
function openModal() {
    displayRateInModal(); // Ensure the modal displays the stored rate and update time
    document.getElementById("rateModal").style.display = "block";
}

// Modal functionality
const modal = document.getElementById("rateModal");
const span = document.getElementsByClassName("close")[0];


// Close the modal when clicking on <span> (x)
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking anywhere outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
// Get the elements
const ratesDisplayButton = document.getElementById("fetchRateButton");

// Function to show the modal when mouse enters the button
ratesDisplayButton.addEventListener("mouseenter", function() {
    modal.style.display = "block";
});

// Function to hide the modal when mouse leaves the modal
modal.addEventListener("mouseleave", function() {
    modal.style.display = "none";
});

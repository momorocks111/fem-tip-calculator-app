"use strict";
// Get DOM Elements
const tipAmountInputs = document.querySelectorAll(".tip-amount");
const customTipInput = document.getElementById("usr-custom");
const customTipLabel = document.getElementById("usr-custom-amount");
const tipAmountText = document.querySelectorAll("tip-text");
const billAmountInput = document.getElementById("usr-amount");
const numOfPeople = document.getElementById("people-num");
const resetBtn = document.getElementById("reset-btn");
const showError = document.getElementById("show-error");
const peopleWrapper = document.querySelector(".people-wrapper");
const tipAmountElement = document.getElementById("tip-amount");
const totalAmountElement = document.getElementById("total-amount");
// Add Event Listeners
billAmountInput.addEventListener("input", handleInputChange);
customTipInput.addEventListener("input", handleCustomTipChange);
tipAmountInputs.forEach((input) => {
    input.addEventListener("click", handleTipSelectionChange);
});
numOfPeople.addEventListener("input", handlePeopleNumberInput);
resetBtn.addEventListener("click", handleReset);
function handleInputChange() {
    handleResetToggle();
    updateTipAndTotalAmount();
}
/**
 * @description Helper function to call updateTip function
 */
function handleCustomTipChange() {
    const customTipChange = parseFloat(customTipInput.value) / 100;
    updateTipAndTotalAmount(customTipChange);
    updateTipAndTotalAmount();
}
/**
 * @description When user clicks on tip boxes, handle the event
 * @param event User clicks on the specific checkbox
 * @returns void
 */
function handleTipSelectionChange(event) {
    const input = event.target;
    tipAmountInputs.forEach((i) => {
        i.checked = i === input;
        const labelElement = document.querySelector(`label[for="${i.id}"]`);
        if (labelElement) {
            labelElement.style.backgroundColor = i.checked
                ? "var(--Strong-cyan-clr)"
                : "var(--Very-dark-cyan-clr)";
            labelElement.style.color = i.checked
                ? "var(--Very-dark-cyan-clr)"
                : "var(--White-clr)";
        }
    });
    const tipPercentage = getTipPercentage(input.id);
    updateTipAndTotalAmount(tipPercentage);
    handleResetToggle();
}
/**
 * @description Find out number of people
 * @returns void
 */
function handlePeopleNumberInput() {
    const inputValue = numOfPeople.value;
    if (inputValue.startsWith("0")) {
        numOfPeople.value = "0";
        showError.style.display = "block";
        peopleWrapper === null || peopleWrapper === void 0 ? void 0 : peopleWrapper.classList.add("error-state");
    }
    else {
        showError.style.display = "none";
        peopleWrapper === null || peopleWrapper === void 0 ? void 0 : peopleWrapper.classList.remove("error-state");
        handleResetToggle();
        updateTipAndTotalAmount();
    }
}
/**
 *
 * @param tipPercentage The initial tip percentage
 * @returns void
 */
function updateTipAndTotalAmount(tipPercentage = 0) {
    const billAmount = parseFloat(billAmountInput.value);
    const numPeople = parseInt(numOfPeople.value);
    if (isNaN(billAmount) || isNaN(numPeople) || numPeople === 0) {
        tipAmountElement.textContent = "$0.00";
        totalAmountElement.textContent = "$0.00";
    }
    else {
        const { tipAmount, totalPerPerson } = calculateAmount(billAmount, tipPercentage, numPeople);
        tipAmountElement.textContent = `$${tipAmount.toFixed(2)}`;
        totalAmountElement.textContent = `$${totalPerPerson.toFixed(2)}`;
    }
}
/**
 * @returns void
 */
function handleResetToggle() {
    const isBillAmountFilled = billAmountInput.value.trim() !== "";
    const isTipPercentageSelected = Array.from(tipAmountInputs).some((input) => input.checked) ||
        customTipInput.value.trim() !== "";
    const isPeopleNumberFilled = numOfPeople.value.trim() !== "";
    resetBtn.classList.toggle("disabled", !(isBillAmountFilled && isTipPercentageSelected && isPeopleNumberFilled));
    resetBtn.classList.toggle("enabled", isBillAmountFilled && isTipPercentageSelected && isPeopleNumberFilled);
}
/**
 * @returns void
 */
function handleReset() {
    if (resetBtn.classList.contains("enabled")) {
        billAmountInput.value = "";
        tipAmountInputs.forEach((i) => {
            i.checked = false;
            const labelElement = document.querySelector(`label[for="${i.id}"]`);
            if (labelElement) {
                labelElement.style.backgroundColor = "var(--Very-dark-cyan-clr)";
                labelElement.style.color = "var(--White-clr)";
            }
        });
        customTipInput.value = "";
        customTipLabel.textContent = "";
        numOfPeople.value = "";
        updateTipAndTotalAmount();
    }
}
/**
 *
 * @param billNum Number of the bill
 * @param tip The tip user chooses
 * @param people The number of people there are splitting the payment
 * @returns number, number
 */
function calculateAmount(billNum, tip, people) {
    if (isNaN(billNum) || isNaN(tip) || isNaN(people) || people == 0) {
        return {
            tipAmount: 0,
            totalPerPerson: 0,
        };
    }
    const total = billNum * (1 + tip);
    const tipAmount = billNum * tip;
    const totalPerPerson = total / people;
    const tipPerPerson = tipAmount / people;
    return {
        tipAmount: tipPerPerson,
        totalPerPerson,
    };
}
/**
 *
 * @param selectedId String which is the value of the selected checkbox
 * @returns number based on text value
 */
function getTipPercentage(selectedId) {
    switch (selectedId) {
        case "five-percent":
            return 0.05;
        case "ten-percent":
            return 0.1;
        case "fifteen-percent":
            return 0.15;
        case "twenty-five-percent":
            return 0.25;
        case "fifty-percent":
            return 0.5;
        case "usr-custom":
            return parseFloat(customTipInput.value) / 100;
    }
    return 0.25;
}

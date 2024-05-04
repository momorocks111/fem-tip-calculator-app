// Get DOM Elements
const tipAmountInputs =
  document.querySelectorAll<HTMLInputElement>(".tip-amount");
const customTipInput = document.getElementById(
  "usr-custom"
) as HTMLInputElement;
const customTipLabel = document.getElementById(
  "usr-custom-amount"
) as HTMLInputElement;
const tipAmountText = document.querySelectorAll<HTMLElement>("tip-text");
const billAmountInput = document.getElementById(
  "usr-amount"
) as HTMLInputElement;
const numOfPeople = document.getElementById("people-num") as HTMLInputElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;
const showError = document.getElementById("show-error") as HTMLElement;
const peopleWrapper = document.querySelector<HTMLElement>(".people-wrapper");
const tipAmountElement = document.getElementById("tip-amount") as HTMLElement;
const totalAmountElement = document.getElementById(
  "total-amount"
) as HTMLElement;

// Add Event Listeners
billAmountInput.addEventListener("input", handleInputChange);
customTipInput.addEventListener("input", handleCustomTipChange);
tipAmountInputs.forEach((input) => {
  input.addEventListener("click", handleTipSelectionChange);
});
numOfPeople.addEventListener("input", handlePeopleNumberInput);
resetBtn.addEventListener("click", handleReset);

function handleInputChange(): void {
  handleResetToggle();
  updateTipAndTotalAmount();
}

/**
 * @description Helper function to call updateTip function
 */
function handleCustomTipChange(): void {
  const customTipChange = parseFloat(customTipInput.value) / 100;
  updateTipAndTotalAmount(customTipChange);
  updateTipAndTotalAmount();
}

/**
 * @description When user clicks on tip boxes, handle the event
 * @param event User clicks on the specific checkbox
 * @returns void
 */
function handleTipSelectionChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  tipAmountInputs.forEach((i) => {
    i.checked = i === input;
    const labelElement = document.querySelector<HTMLLIElement>(
      `label[for="${i.id}"]`
    );
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
function handlePeopleNumberInput(): void {
  const inputValue = numOfPeople.value;

  if (inputValue.startsWith("0")) {
    numOfPeople.value = "0";
    showError.style.display = "block";
    peopleWrapper?.classList.add("error-state");
  } else {
    showError.style.display = "none";
    peopleWrapper?.classList.remove("error-state");
    handleResetToggle();
    updateTipAndTotalAmount();
  }
}

/**
 *
 * @param tipPercentage The initial tip percentage
 * @returns void
 */
function updateTipAndTotalAmount(tipPercentage = 0): void {
  const billAmount = parseFloat(billAmountInput.value);
  const numPeople = parseInt(numOfPeople.value);

  if (isNaN(billAmount) || isNaN(numPeople) || numPeople === 0) {
    tipAmountElement.textContent = "$0.00";
    totalAmountElement.textContent = "$0.00";
  } else {
    const { tipAmount, totalPerPerson } = calculateAmount(
      billAmount,
      tipPercentage,
      numPeople
    );
    tipAmountElement.textContent = `$${tipAmount.toFixed(2)}`;
    totalAmountElement.textContent = `$${totalPerPerson.toFixed(2)}`;
  }
}

/**
 * @returns void
 */
function handleResetToggle(): void {
  const isBillAmountFilled = billAmountInput.value.trim() !== "";
  const isTipPercentageSelected =
    Array.from(tipAmountInputs).some((input) => input.checked) ||
    customTipInput.value.trim() !== "";
  const isPeopleNumberFilled = numOfPeople.value.trim() !== "";

  resetBtn.classList.toggle(
    "disabled",
    !(isBillAmountFilled && isTipPercentageSelected && isPeopleNumberFilled)
  );
  resetBtn.classList.toggle(
    "enabled",
    isBillAmountFilled && isTipPercentageSelected && isPeopleNumberFilled
  );
}

/**
 * @returns void
 */
function handleReset(): void {
  if (resetBtn.classList.contains("enabled")) {
    billAmountInput.value = "";
    tipAmountInputs.forEach((i) => {
      i.checked = false;
      const labelElement = document.querySelector<HTMLLabelElement>(
        `label[for="${i.id}"]`
      );
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
function calculateAmount(
  billNum: number,
  tip: number,
  people: number
): { tipAmount: number; totalPerPerson: number } {
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
function getTipPercentage(selectedId: string): number {
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

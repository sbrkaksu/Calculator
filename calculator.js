"use strict";

// Select the buttons
const keyButton = document.querySelectorAll(
  ".button.key_numbers, .button.key_operators"
);

//Select the div contains display screen
const display = document.querySelector(".display_screen");

let display_screen = ""; // The string controls the innerHTML of the display screen
let tempMem = []; // Temprorary memory throws the last element after any operator clicked
let finalMem = ""; // Final memory to be calculated
let result = ""; // The string to be used for the calculation of the final memory
let isScreenEmpty = true; // A boolean to check whether the screen empty
let numberOfOperatorClicks = 0; // A counter to check if any operator is clicked. Besides, to be used to control the order of the operation
let isPercentageClicked = false; // A boolean to check whether is '%' clicked
let isEqualClicked = false; // A boolean to check whether is '=' clicked

let calc = function (str) {
  const func = new Function(`return ${str}`); // A function to calculate the string which means the result
  return func();
};

keyButton.forEach((button) => {
  button.addEventListener("click", () => {
    const buttonValue = button.getAttribute("data-value");
    switch (buttonValue) {
      case ".":
        if (!isScreenEmpty) {
          // Do not insert '.' when the screen is empty
          display_screen += buttonValue;
          display.innerHTML = display_screen;
          tempMem.push(display_screen);
          numberOfOperatorClicks = 0;
        }
        break;
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        display_screen += buttonValue; // Add the numbers to the empty string
        display.innerHTML = display_screen; // Display the number
        tempMem.push(display_screen); // Push the number on the screen to the temp memory
        isScreenEmpty = false; // Update the boolean as the screen is not empty
        numberOfOperatorClicks = 0; // Update the counter
        break;
      case "+":
      case "-":
      case "*":
      case "/":
        if (!isScreenEmpty) {
          // Do not do anything if the the screen is empty
          numberOfOperatorClicks++; // Increase the counter when user clicks '+','_','*' or '/'
          if (numberOfOperatorClicks == 1) {
            // When clicked for the first time
            finalMem += `${tempMem[tempMem.length - 1]}${buttonValue}`; // Add the last number and the operator to the string to be calculated
            display_screen = ""; // Clear the screen
          } else {
            // Update the operator if the user changes it
            if (isPercentageClicked) {
              finalMem += buttonValue;
              isPercentageClicked = false;
              // isEqualClicked = false;
            } else if (isEqualClicked) {
              finalMem += buttonValue;
              isEqualClicked = false;
            } else {
              finalMem = finalMem.replace(/.$/, `${buttonValue}`);
            }
          }
          if (
            (buttonValue == "*" || buttonValue == "/") &&
            (finalMem.slice(0, -1).includes("+") ||
              finalMem.slice(0, -1).includes("-"))
          ) {
            result = tempMem[tempMem.length - 1]; // If '*' or '/' clicked, show temporarily the last number. Also, if there is '+' or '-' inside the finalMem, do not calculate now
          } else {
            result = `${calc(finalMem.slice(0, -1))}`; // Slice the last char then calculate the finalMem
            finalMem = `${result}${buttonValue}`; // Update the finalMem
          }
          result.length > 13
            ? (display.innerHTML = Number(result).toExponential(8))
            : (display.innerHTML = Number(result)); // If the result overflows from the screen, show the result as exp
        }
        break;
      case "%":
        if (!isScreenEmpty) {
          // Do not do anything if the the screen is empty
          numberOfOperatorClicks++; // Increase the counter since user clicked operator
          isPercentageClicked = true; // Percentage clicked
          if (numberOfOperatorClicks == 1) {
            finalMem += `${tempMem[tempMem.length - 1]}/100`;
            display_screen = "";
          } else {
            finalMem.endsWith("+") ||
            finalMem.endsWith("-") ||
            finalMem.endsWith("*") ||
            finalMem.endsWith("/")
              ? (finalMem = `${finalMem.slice(0, -1)}/100`) // if user clicks '%' after '+', '-', '*' '/', update correctly, if not continue
              : (finalMem = `${finalMem}/100`);
          }
          if (
            finalMem.slice(0, -4).includes("+") ||
            finalMem.slice(0, -4).includes("-")
          ) {
            // if finalMem includes  '+', '-', '*' '/', show temprorarily the last number and continue
            if (numberOfOperatorClicks == 1) {
              result = `${calc(tempMem[tempMem.length - 1] / 100)}`;
            } else {
              result = `${+result / 100}`;
            }
          } else {
            result = `${calc(finalMem)}`; // Calculate the finalMem
          }
          result.length > 13
            ? (display.innerHTML = Number(result).toExponential(8))
            : (display.innerHTML = Number(result));
        }
        break;
      case "=":
        if (!isScreenEmpty) {
          numberOfOperatorClicks++;
          isEqualClicked = true; // '=' clicked
          if (numberOfOperatorClicks == 1) {
            if (isPercentageClicked) {
              isPercentageClicked = false;
            } else {
              finalMem += tempMem[tempMem.length - 1];
            }
          } else {
          }
          result = `${calc(finalMem)}`;
          display_screen = ""; // Clear screen
          finalMem = `${result}`; // Update the finalMem
          result.length > 13
            ? (display.innerHTML = Number(result).toExponential(8))
            : (display.innerHTML = Number(result));
        }
        break;
      case "AC": // Clear
        display.innerHTML = "";
        display_screen = "";
        tempMem = [];
        finalMem = [];
        result = "";
        isScreenEmpty = true;
        numberOfOperatorClicks = 0;
        isPercentageClicked = false;
        isEqualClicked = false;
        break;
    }
  });
});

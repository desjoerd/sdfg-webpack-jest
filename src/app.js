(function () {

  const add = (a, b) => a + b;
  const subtract = (a, b) => a - b;
  const multiply = (a, b) => a * b;
  const divide = (a, b) => a / b;

  class BasicCalculator {
    constructor(element) {
      // left and right are the two numbers on which operands will operate
      this.left = element.querySelector('.inputs #left');
      this.right = element.querySelector('.inputs #right');

      // the 4 different operand buttons, +,-,*,/
      const operatorAddEl = element.querySelector('.operators #add');
      const operatorSubtractEl = element.querySelector('.operators #subtract');
      const operatorMultiplyEl = element.querySelector('.operators #multiply');
      const operatorDivideEl = element.querySelector('.operators #divide');

      // the result label
      this.resultEl = element.querySelector('#result-value');

      this.connect(operatorAddEl, add);
      this.connect(operatorSubtractEl, subtract);
      this.connect(operatorMultiplyEl, multiply);
      this.connect(operatorDivideEl, divide);
    }

    connect(operatorButton, operatorFunc) {
      operatorButton.addEventListener('click', () => {
        // pass the value in each number to the relevant operator
        const result = operatorFunc(Number.parseInt(this.left.value), Number.parseInt(this.right.value));
        // display the result]
        this.resultEl.innerHTML = result;
      });
    }
  }

  const basicCalculatorElement = document.getElementById('basic-calculator');
  const calculator = new BasicCalculator(basicCalculatorElement);

})();
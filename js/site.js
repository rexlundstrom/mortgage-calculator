// Remaining Balance before the very first month equals the amount of the loan.

// basic math functions
const calculateMonthlyPayment = (loan, months, rate) =>
  (loan * (rate / 1200)) / (1 - (1 + rate / 1200) ** -months);
const calculateInterestPayment = (balance, rate) => balance * (rate / 1200);
const calculatePrincipalPayment = (monthlyPayment, interestPayment) =>
  monthlyPayment - interestPayment;
const calculateRemainingBalance = (previousBalance, principalPayment) =>
  previousBalance - principalPayment;

// control function

const controller = () => {
  displayMortgageData(getMortgageData());
};

const getMortgageData = () => {
  // get input values
  let loan = document.getElementById("loanAmount").value;
  let months = document.getElementById("monthAmount").value;
  let interest = document.getElementById("interestRate").value;

  let output = [];
  let principal = loan;
  let totalInterest = 0;
  for (let i = 1; i <= months; i++) {
    const thisRow = {};
    thisRow.month = i;
    thisRow.payment = calculateMonthlyPayment(loan, months, interest);
    thisRow.interest = calculateInterestPayment(principal, interest);
    thisRow.principal = calculatePrincipalPayment(
      thisRow.payment,
      thisRow.interest
    );
    totalInterest += thisRow.interest;
    principal -= thisRow.principal;
    thisRow.totalInterest = totalInterest;
    thisRow.balance = principal;

    output.push(thisRow);
  }

  return output;
};

// populate table

const displayMortgageData = (calculations) => {
  const mortgageTable = document.getElementById("mortgageTable");
  const template = document.getElementById("tableRowTemplate");
  mortgageTable.innerHTML = "";

  for (let i = 0; i < calculations.length; i++) {
    let currentMonth = calculations[i];
    let tableRow = document.importNode(template.content, true);
    const dollars = new Intl.NumberFormat("en-us", {
      currency: "USD",
      style: "currency",
    });

    tableRow.querySelector('[data-id="month"]').textContent =
      currentMonth.month.toLocaleString();
    tableRow.querySelector('[data-id="payment"]').textContent = dollars.format(
      Math.abs(currentMonth.payment)
    );
    tableRow.querySelector('[data-id="principal"]').textContent =
      dollars.format(Math.abs(currentMonth.principal));
    tableRow.querySelector('[data-id="interest"]').textContent = dollars.format(
      Math.abs(currentMonth.interest)
    );
    tableRow.querySelector('[data-id="totalInterest"]').textContent =
      dollars.format(Math.abs(currentMonth.totalInterest));
    tableRow.querySelector('[data-id="balance"]').textContent = dollars.format(
      Math.abs(currentMonth.balance)
    );

    // tableRow.querySelector("tr").setAttribute("data-event", i+1);
    mortgageTable.appendChild(tableRow);
  }
  let monthlyPayment = calculations[0].payment;
  let totalPrincipal = document.getElementById("loanAmount").value;
  let totalInterest = calculations[calculations.length - 1].totalInterest;
  displayTotalPayments(monthlyPayment, totalPrincipal, totalInterest);
};

const displayTotalPayments = (
  monthlyPayment,
  totalPrincipal,
  totalInterest
) => {
  const dollars = new Intl.NumberFormat("en-us", {
    currency: "USD",
    style: "currency",
  });
  console.log(monthlyPayment)
  document.getElementById("monthlyPayment").textContent =
    dollars.format(monthlyPayment);
  document.getElementById("totalPrincipal").textContent =
    dollars.format(totalPrincipal);
  document.getElementById("totalInterest").textContent =
    dollars.format(totalInterest);
  document.getElementById("totalCost").textContent = (
    dollars.format((totalInterest + Number(totalPrincipal)))
  );
};

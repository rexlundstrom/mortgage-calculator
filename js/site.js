

// Remaining Balance before the very first month equals the amount of the loan.

// basic math functions
const calculateMonthlyPayment = (loan, months, rate) =>
  (loan * (rate / 1200)) / (1 - (1 + rate / 1200) ** -months);
const calculateInterestPayment = (balance, rate) => balance * (rate / 1200);
const calculatePrincipalPayment = (monthlyPayment, interestPayment) =>
  monthlyPayment - interestPayment;
const calculateRemainingBalance = (previousBalance, principalPayment) =>
  previousBalance - principalPayment;

// show data summary

// const displayStats = (currentEvents) => {
//   let statistics = calculateStats(currentEvents);
//   document.getElementById("total").textContent =
//     statistics.total.toLocaleString();
//   document.getElementById("average").textContent = Math.round(
//     statistics.average
//   ).toLocaleString();
//   document.getElementById("most").textContent =
//     statistics.most.toLocaleString();
//   document.getElementById("least").textContent =
//     statistics.least.toLocaleString();
// };

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

    tableRow.querySelector('[data-id="month"]').textContent = (
      Math.round(100 * currentMonth.month) / 100
    ).toLocaleString();
    tableRow.querySelector('[data-id="payment"]').textContent =
      "$" + (Math.round(100 * currentMonth.payment) / 100).toLocaleString();
    tableRow.querySelector('[data-id="principal"]').textContent =
      "$" + (Math.round(100 * currentMonth.principal) / 100).toLocaleString();
    tableRow.querySelector('[data-id="interest"]').textContent =
      "$" + (Math.round(100 * currentMonth.interest) / 100).toLocaleString();
    tableRow.querySelector('[data-id="totalInterest"]').textContent =
      "$" +
      (Math.round(100 * currentMonth.totalInterest) / 100).toLocaleString();
    tableRow.querySelector('[data-id="balance"]').textContent =
      "$" + (Math.round(100 * currentMonth.balance) / 100).toLocaleString();

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
  document.getElementById("monthlyPayment").textContent = Math.round(100 * monthlyPayment)/100;
  document.getElementById("totalPrincipal").textContent = Math.round(100 * totalPrincipal)/100;
  document.getElementById("totalInterest").textContent = Math.round(100 * totalInterest)/100;
  document.getElementById("totalCost").textContent = (Math.round(100 * (totalInterest + Number(totalPrincipal)))/100).toLocaleString();
};

// function displayMessage() {
//   let msg = document.getElementById("message").value;
//   // alert(msg);

//   Swal.fire({
//     backdrop: false,
//     title: "Loan Savvy",
//     text: msg,
//   });
// }

document.getElementById('form').addEventListener('submit', addTransaction)

const savings = document.getElementById('savings')
const incomeTotal = document.getElementById('incomeTotal')
const expenseTotal = document.getElementById('expenseTotal')
const list = document.getElementById('list')
const form = document.getElementById('form')
const description = document.getElementById('description')
const amount = document.getElementById('amount')

const date = new Date();
const current_date = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear(); 
document.getElementById('date').innerHTML = current_date;

//initial array of expenses from localStorage
const transactionsFromLS = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage.getItem('transactions') !== null ? transactionsFromLS : [];

start()
// Add transaction
function addTransaction(e) {
    e.preventDefault();

    if (description.value === '' && amount.value === '') {
      document.getElementById("error-message").innerHTML = `<span>Error: Please enter a value for all the boxes below</span>`;
        setTimeout(() => (
            document.getElementById("error-message").innerHTML = ""),
            3000
        );
    } else {
        const transaction = {
            id: Math.floor(Math.random() * 10000),
            description: description.value,
            amount: +amount.value
        }
        transactions.push(transaction);
        addTransactionDOM(transaction);
    } 
        
        updateValues()
        updateLocalStorage()

        description.value = ''
        amount.value = ''
}

//Add transactions to DOM list
function addTransactionDOM(transaction) {
    //get sign
    const sign = transaction.amount < 0 ? '-' : '+';

    const item = document.createElement('li');

    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

    item.innerHTML = `
    
        ${transaction.description} <span>${sign}${Math.abs(transaction.amount)}</span>
        <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
    `;

    list.appendChild(item);
}

//update the balance, income and expense
function updateValues() {
    const amounts = transactions.map(transaction => Number(transaction.amount))

    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc += item), 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => (acc += item), 0) * -1).toFixed(2);

    savings.innerText = `€${total}`;
    incomeTotal.innerText = `€${income}`;
    expenseTotal.innerText = `€${expense}`;
}

//Remove transaction by ID
function deleteTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);

    updateLocalStorage();
    start()
}

//update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

function start() {
    list.innerHTML = ''
    transactions.forEach(addTransactionDOM)
    updateValues()
}
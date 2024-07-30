// Define DOM elements
const elements = {
    loginSection: document.getElementById('loginSection'),
    bankingSection: document.getElementById('bankingSection'),
    exitLink: document.getElementById('exit'),
    usernameField: document.getElementById('username'),
    passwordField: document.getElementById('password'),
    retry: document.getElementById('retry'),
    loginForm: document.getElementById('loginForm'),
    operation: document.getElementById('operation'),
    withdrawButton: document.getElementById('withdrawButton'),
    depositButton: document.getElementById('depositButton'),
    transferButton: document.getElementById('transferButton'),
    withdrawAmount: document.getElementById('withdrawAmount'),
    depositAmount: document.getElementById('depositAmount'),
    transferAmount: document.getElementById('transferAmount'),
    accountID: document.getElementById('accountID'),
    bankingMessage: document.getElementById('bankingMessage'),
    bankingForm: document.getElementById('bankingForm'),
    loginMessage: document.getElementById('loginMessage')
};

// Initialize users array
let users = JSON.parse(localStorage.getItem('users')) || [
    { AccountID: 1234, name: 'Eman', password: '1111aaaa', amount: 10000 },
    { AccountID: 5678, name: 'Sara', password: 'abcd1234', amount: 20000 },
    { AccountID: 3344, name: 'Noor', password: 'ssss1111', amount: 50000 }
];

// Save user data to localStorage
function saveUserData() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Authenticate user
function authenticateUser(username, password) {
    return users.find(u => u.name === username && u.password === password);
}

// Handle banking operations
function handleBankingOperation(operation, amount, destinationAccountID) {
    const user = currentUser;
    const recipient = users.find(u => u.AccountID === destinationAccountID);

    if (operation === 'withdraw') {
        if (user.amount >= amount) {
            user.amount -= amount;
            updateMessage(`Withdrawal of ${amount} successful. New balance: ${user.amount}.`);
        } else {
            updateMessage('Insufficient balance.');
        }
    } else if (operation === 'deposit') {
        user.amount += amount;
        updateMessage(`Deposit of ${amount} successful. New balance: ${user.amount}.`);
    } else if (operation === 'transfer') {
        if (recipient) {
            if (user.amount >= amount) {
                user.amount -= amount;
                recipient.amount += amount;
                updateMessage(`Transfer of ${amount} to account ${destinationAccountID} completed. New balance: ${user.amount}.`);
            } else {
                updateMessage('Insufficient balance.');
            }
        } else {
            updateMessage('Account not found.');
        }
    }
    saveUserData();
    resetBankingUI();
}

// Update message to user
function updateMessage(message) {
    document.getElementById('bankingHeading').style.display = 'none';
    elements.bankingMessage.textContent = message;
}

// Reset banking UI
function resetBankingUI() {
    elements.bankingForm.classList.add('hidden');
}

// Handle login form submission
elements.loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = elements.usernameField.value;
    const password = elements.passwordField.value;

    const user = authenticateUser(username, password);

    if (user) {
        currentUser = user;
        elements.loginSection.classList.add('hidden');
        elements.bankingSection.classList.remove('hidden');
        elements.loginMessage.textContent = '';
    } else {
        elements.loginMessage.textContent = 'Invalid Username or Password.';
    }
});

// Handle operation selection
elements.operation.addEventListener('change', function() {
    const operation = this.value;
    const sections = ['withdrawSection', 'depositSection', 'transferSection'];

    sections.forEach(section => {
        document.getElementById(section).classList.add('hidden');
    });

    if (operation === '1') {
        document.getElementById('withdrawSection').classList.remove('hidden');
    } else if (operation === '2') {
        document.getElementById('depositSection').classList.remove('hidden');
    } else if (operation === '3') {
        document.getElementById('transferSection').classList.remove('hidden');
    }
});

// Handle withdraw button click
elements.withdrawButton.addEventListener('click', function() {
    const amount = Number(elements.withdrawAmount.value);
    handleBankingOperation('withdraw', amount);
});

// Handle deposit button click
elements.depositButton.addEventListener('click', function() {
    const amount = Number(elements.depositAmount.value);
    handleBankingOperation('deposit', amount);
});

// Handle transfer button click
elements.transferButton.addEventListener('click', function() {
    const amount = Number(elements.transferAmount.value);
    const destinationAccountID = Number(elements.accountID.value);
    handleBankingOperation('transfer', amount, destinationAccountID);
});

const totalAmountDisplay = document.querySelector('.total-amount');
const count5Display = document.querySelector('.count-5');
const count25Display = document.querySelector('.count-25');
const count50Display = document.querySelector('.count-50');
const addAmount5Btn = document.querySelector('.add-amount-5');
const addAmount25Btn = document.querySelector('.add-amount-25');
const addAmount50Btn = document.querySelector('.add-amount-50');
const addToTotalBtn = document.querySelector('.add-to-total');
const clearTotalBtn = document.querySelector('.clear-total');
const delete5Btn = document.querySelector('.delete-5');
const delete25Btn = document.querySelector('.delete-25');
const delete50Btn = document.querySelector('.delete-50');

let totalAmount = 0;
let count5 = 0;
let count25 = 0;
let count50 = 0;

addAmount5Btn.addEventListener('click', () => {
  count5++;
  count5Display.textContent = count5;
  updateTotalAmount();
});

addAmount25Btn.addEventListener('click', () => {
  count25++;
  count25Display.textContent = count25;
  updateTotalAmount();
});

addAmount50Btn.addEventListener('click', () => {
  count50++;
  count50Display.textContent = count50;
  updateTotalAmount();
});

addToTotalBtn.addEventListener('click', () => {
  updateTotalAmount();
});

clearTotalBtn.addEventListener('click', () => {
  totalAmount = 0;
  count5 = 0;
  count25 = 0;
  count50 = 0;
  totalAmountDisplay.textContent = '$0';
  count5Display.textContent = '0';
  count25Display.textContent = '0';
  count50Display.textContent = '0';
});

delete5Btn.addEventListener('click', () => {
  if (count5 > 0) {
    count5--;
    count5Display.textContent = count5;
    updateTotalAmount();
  }
});

delete25Btn.addEventListener('click', () => {
  if (count25 > 0) {
    count25--;
    count25Display.textContent = count25;
    updateTotalAmount();
  }
});

delete50Btn.addEventListener('click', () => {
  if (count50 > 0) {
    count50--;
    count50Display.textContent = count50;
    updateTotalAmount();
  }
});

function updateTotalAmount() {
  totalAmount = count5 * 5 + count25 * 25 + count50 * 50;
  totalAmountDisplay.textContent = `$${totalAmount}`;
}

// Generate a random verification code
function generateCaptcha() {
  let captcha = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < 6; i++) {
    captcha += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return captcha;
}

// Display the verification code on the page
const captchaDisplay = document.getElementById('captcha-display');
captchaDisplay.textContent = generateCaptcha();

// Handle the login form submission
const loginForm = document.getElementById('login-form');
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const captcha = document.getElementById('captcha').value;

  if (username === 'Admin' && password === '12345' && captcha === captchaDisplay.textContent) {
    // Redirect to the admin page
    window.location.href = 'Admin.html';
  } else {
    alert('Incorrect username, password, or verification code. Please contact the administrator.');
  }
});
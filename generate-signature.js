const crypto = require('crypto');

const secret = 'v1,whsec_8Nai+cf4HJGBSSvxur1lXVp2H1z8F6sN8SQgQZLfEGuwDjWQSTV/tM86YJ7sFAoz/K/4+x+ZYYTIuugO'; // <-- Replace with your actual secret
const body = JSON.stringify({
  email: "ojetundejide@gmail.com",      // <-- Replace with your email
  password: "Elijah1234"      // <-- Replace with your password
});

const hmac = crypto.createHmac('sha256', secret);
const signature = hmac.update(body).digest('hex');

console.log('Signature:', signature);
console.log('Body:', body);
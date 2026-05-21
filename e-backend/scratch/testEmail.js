const path = require('path');

// Ensure correct working directory so env configs load perfectly
process.chdir(path.join(__dirname, '..'));

const env = require('../config/env');
const emailService = require('../services/email.service');

const runTest = async () => {
  console.log('--- START SMTP CONNECTION DIAGNOSTIC ---');
  console.log('Configured Sender Email:', env.email.user);
  console.log('App Password Detected:', env.email.pass ? 'YES (Valid Length)' : 'NO');
  
  if (!env.email.user || !env.email.pass) {
    console.error('SMTP configuration is missing in config/env! Check your env/.env file.');
    process.exit(1);
  }

  const mockUser = {
    name: 'Vashu Thakur',
    email: env.email.user // Send a test email to oneself
  };

  console.log('Triggering a test welcome email to:', mockUser.email);
  try {
    const result = await emailService.sendWelcomeEmail(mockUser);
    if (result && result.mock) {
      console.log('Warning: Email was sent in MOCK mode. Transporter was not initialized.');
    } else if (result) {
      console.log('Success! Test email sent successfully.');
      console.log('Delivery Response info:', JSON.stringify(result));
    } else {
      console.error('Failure: emailService returned null or undefined. Check server logs.');
    }
  } catch (error) {
    console.error('Diagnostic error caught:', error);
  }
  
  console.log('--- END SMTP CONNECTION DIAGNOSTIC ---');
  process.exit(0);
};

runTest();

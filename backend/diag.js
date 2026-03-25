require('dotenv').config({ path: '../.env.local' });
console.log('--- Environment Check ---');
console.log('RESEND_API_KEY:', process.env.RESEND_API_KEY ? 'Present (First 5: ' + process.env.RESEND_API_KEY.substring(0, 5) + ')' : 'MISSING');
console.log('SMTP_HOST:', process.env.SMTP_HOST || 'None');
console.log('SMTP_USER:', process.env.SMTP_USER ? 'Present' : 'MISSING');
console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Present' : 'MISSING');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Present' : 'MISSING');
console.log('------------------------');

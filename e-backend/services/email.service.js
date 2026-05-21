const env = require('../config/env');
const nodemailer = require('nodemailer');

let transporter = null;

// Initialize Gmail SMTP Transporter if credentials exist
if (env.email.user && env.email.pass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Connection Validation Failed:', error.message);
    } else {
      console.log('SMTP server successfully connected & ready to send emails');
    }
  });
} else {
  console.warn('SMTP Credentials not configured. Email service will run in MOCK mode (logging to console).');
}

/**
 * Utility to wrap HTML content in a consistent luxury-themed layout
 */
const getBaseTemplate = (title, content) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        body {
          margin: 0;
          padding: 0;
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background-color: #f8fafc;
          color: #1e293b;
          -webkit-font-smoothing: antialiased;
        }
        .wrapper {
          width: 100%;
          background-color: #f8fafc;
          padding: 40px 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          border: 1px solid #e2e8f0;
        }
        .header {
          background-color: #0f172a;
          padding: 30px 40px;
          text-align: center;
        }
        .header h1 {
          color: #ffffff;
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px;
        }
        .footer {
          background-color: #f1f5f9;
          padding: 24px 40px;
          text-align: center;
          border-top: 1px solid #e2e8f0;
        }
        .footer p {
          margin: 6px 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
        .footer-logo {
          font-weight: 700;
          letter-spacing: 1px;
          color: #0f172a !important;
          text-decoration: none;
          display: inline-block;
          margin-bottom: 10px;
          font-size: 14px;
        }
        .btn {
          display: inline-block;
          background-color: #4f46e5;
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 30px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          text-align: center;
          margin: 20px 0;
          box-shadow: 0 4px 10px rgba(79, 70, 229, 0.2);
          transition: background-color 0.2s ease;
        }
        .btn:hover {
          background-color: #4338ca;
        }
        h2 {
          font-size: 20px;
          font-weight: 600;
          color: #0f172a;
          margin-top: 0;
        }
        p {
          font-size: 15px;
          line-height: 1.6;
          color: #334155;
          margin-top: 0;
          margin-bottom: 16px;
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div class="header">
            <h1>Stylee</h1>
          </div>
          <div class="content">
            ${content}
          </div>
          <div class="footer">
            <a href="${env.clientUrl}" class="footer-logo">STYLEE FASHION</a>
            <p>Thank you for choosing Stylee. High quality, premium fashion crafted for you.</p>
            <p>&copy; ${new Date().getFullYear()} Stylee Inc. All rights reserved.</p>
            <p style="font-size: 10px; margin-top: 15px;">If you didn't request this email, please ignore or contact support.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Send an email using standard SMTP or fallback to console logs in development
 */
const sendMail = async ({ to, subject, html, text }) => {
  const fromName = 'Stylee Fashion';
  const fromEmail = env.email.user || 'no-reply@styleefashion.com';

  if (!transporter) {
    console.log('\n===== [MOCK EMAIL SENT] =====');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`From: ${fromName} <${fromEmail}>`);
    console.log(`Body Snippet: ${text || 'HTML Content'}`);
    console.log('=============================\n');
    return { mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: `"${fromName}" <${fromEmail}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Email successfully delivered. Message ID: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Nodemailer Send Failure Exception:', error);
    // Silent catch in production/development to keep application APIs functional
    return null;
  }
};

/**
 * Send welcome email to a new user
 */
const sendWelcomeEmail = async (user) => {
  const title = 'Welcome to Stylee Fashion';
  const content = `
    <h2>Welcome to the family, ${user.name}!</h2>
    <p>We are absolutely thrilled to welcome you to <strong>Stylee</strong>, your new home for luxury, curated fashion and styles.</p>
    <p>Your account has been successfully created under <strong>${user.email}</strong>. You now have full access to explore our exclusive catalog, craft your custom wishlist, and enjoy premium seasonal discounts.</p>
    <div style="text-align: center;">
      <a href="${env.clientUrl}/shop" class="btn" target="_blank">Start Exploring</a>
    </div>
    <p style="margin-top: 25px;">To celebrate your arrival, keep an eye out for dynamic seasonal drops and updates on new premium arrivals.</p>
    <p>If you have any questions or need styling advice, our concierge team is always here for you at any time.</p>
    <p style="margin-bottom: 0;">Warm regards,<br><strong>The Stylee Concierge Team</strong></p>
  `;

  const html = getBaseTemplate(title, content);
  const text = `Welcome to Stylee Fashion, ${user.name}! Your account has been registered successfully. Start shopping now at ${env.clientUrl}`;

  // Execute in the background asynchronously
  return sendMail({
    to: user.email,
    subject: 'Welcome to Stylee Fashion!',
    html,
    text,
  });
};

/**
 * Send order invoice summary to the buyer
 */
const sendOrderConfirmationEmail = async (user, order) => {
  const currencyFormatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  });

  const formattedTotal = currencyFormatter.format(order.pricing.total);
  const formattedSubtotal = currencyFormatter.format(order.pricing.subtotal);
  const formattedShipping = currencyFormatter.format(order.pricing.shipping);
  const formattedDiscount = currencyFormatter.format(order.pricing.discount);

  // Generate item table rows
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr style="border-bottom: 1px solid #f1f5f9;">
        <td style="padding: 12px 8px; text-align: left; font-size: 14px;">
          <strong style="color: #0f172a; display: block;">${item.name}</strong>
          ${item.size || item.color ? `<span style="font-size: 11px; color: #64748b;">Option: ${[item.size, item.color].filter(Boolean).join(' / ')}</span>` : ''}
        </td>
        <td style="padding: 12px 8px; text-align: center; font-size: 14px; color: #475569;">x${item.quantity}</td>
        <td style="padding: 12px 8px; text-align: right; font-size: 14px; font-weight: 500; color: #0f172a;">${currencyFormatter.format(item.price)}</td>
      </tr>
    `
    )
    .join('');

  const title = `Your Stylee Invoice - Order #${order.orderNumber}`;
  const content = `
    <h2>Thank you for your order!</h2>
    <p>Hi ${user.name}, your premium order has been successfully placed. We're getting it ready to be shipped directly to your wardrobe.</p>
    
    <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin: 25px 0; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; font-size: 15px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Order Reference</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Order Number:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0f172a;">${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Payment Method:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600; color: #0f172a;">${order.payment.method}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Payment Status:</td>
          <td style="padding: 4px 0; text-align: right; font-weight: 600; color: ${order.payment.status === 'Paid' ? '#16a34a' : '#ea580c'};">${order.payment.status}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #64748b;">Date:</td>
          <td style="padding: 4px 0; text-align: right; color: #0f172a;">${new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}</td>
        </tr>
      </table>
    </div>

    <h3 style="font-size: 16px; font-weight: 600; color: #0f172a; margin-bottom: 12px; margin-top: 25px;">Item Summary</h3>
    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0; font-size: 12px; text-transform: uppercase; color: #64748b; letter-spacing: 1px;">
          <th style="padding: 8px; text-align: left; font-weight: 600;">Product</th>
          <th style="padding: 8px; text-align: center; font-weight: 600; width: 60px;">Qty</th>
          <th style="padding: 8px; text-align: right; font-weight: 600; width: 100px;">Price</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="width: 250px; margin-left: auto; margin-bottom: 30px;">
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Subtotal:</td>
          <td style="padding: 6px 0; text-align: right; color: #0f172a;">${formattedSubtotal}</td>
        </tr>
        ${
          order.pricing.discount > 0
            ? `
        <tr>
          <td style="padding: 6px 0; color: #ea580c;">Discount:</td>
          <td style="padding: 6px 0; text-align: right; color: #ea580c;">-${formattedDiscount}</td>
        </tr>
        `
            : ''
        }
        <tr>
          <td style="padding: 6px 0; color: #64748b;">Shipping:</td>
          <td style="padding: 6px 0; text-align: right; color: #0f172a;">${order.pricing.shipping === 0 ? 'Free' : formattedShipping}</td>
        </tr>
        <tr style="border-top: 1px solid #e2e8f0; font-weight: 700; font-size: 16px;">
          <td style="padding: 10px 0 0 0; color: #0f172a;">Grand Total:</td>
          <td style="padding: 10px 0 0 0; text-align: right; color: #4f46e5;">${formattedTotal}</td>
        </tr>
      </table>
    </div>

    <div style="background-color: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 1px solid #e2e8f0;">
      <h3 style="margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">Delivery Address</h3>
      <p style="font-size: 13px; line-height: 1.5; color: #334155; margin: 0;">
        <strong>${order.shippingAddress.fullName}</strong><br>
        ${order.shippingAddress.street}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}<br>
        ${order.shippingAddress.country}<br>
        Contact: ${order.shippingAddress.phone}
      </p>
    </div>

    <p style="font-size: 13px; color: #64748b; margin-top: 25px;">
      You can track the shipment status of your order anytime by visiting your personal dashboard account on our store.
    </p>
  `;

  const html = getBaseTemplate(title, content);
  const text = `Thank you for your order, ${user.name}! Order Reference: #${order.orderNumber}. Grand Total: ${formattedTotal}. We are processing your delivery shipment now.`;

  // Execute in the background asynchronously
  return sendMail({
    to: user.email,
    subject: `Order Confirmed! Receipt for Order #${order.orderNumber}`,
    html,
    text,
  });
};

/**
 * Send password reset link to a user
 */
const sendPasswordResetEmail = async (user, resetUrl) => {
  const title = 'Reset Your Password';
  const content = `
    <h2>Password Reset Request</h2>
    <p>Hi ${user.name},</p>
    <p>We received a request to reset your password for your <strong>Stylee</strong> account.</p>
    <p>Click the button below to set up a new password. This link is only active for <strong>10 minutes</strong> for your security.</p>
    <div style="text-align: center;">
      <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
    </div>
    <p style="margin-top: 25px;">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
    <p style="margin-bottom: 0;">Warm regards,<br><strong>The Stylee Concierge Team</strong></p>
  `;

  const html = getBaseTemplate(title, content);
  const text = `Reset your password by visiting this link: ${resetUrl}. This link is valid for 10 minutes.`;

  return sendMail({
    to: user.email,
    subject: 'Stylee Fashion - Password Reset Request',
    html,
    text,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendPasswordResetEmail,
};

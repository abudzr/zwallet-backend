const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
// const host = process.env.HOST;
// const port = process.env.PORT_FRONTEND;
// const api = process.env.PORT;
// const linkApi = `http://${host}:${api}`;
const linkApi = process.env.API;
const link = process.env.LINK;
// const link = `http://${host}:${port}`;
const email = process.env.EMAIL_USER;
const password = process.env.EMAIL_PASS;

const transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    auth: {
      user: email,
      pass: password,
    },
  })
);

const send = (destination, token, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (type === "verify") {
        const info = await transporter.sendMail({
          from: email,
          to: destination,
          subject: "Zwallet Account: Email address verification",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
          </style>
          </head>
          <body>
              <div class="container">
              <h2>Welcome to the Zwallet account registration: Please confirm!</h2>
              <p>You have registered a Zwallet account with ${destination}. Please click link to continue verification account.</p>
              <a href="${linkApi}/api/v1/users/auth/verify?email=${destination}&token=${token}"> Click Here to Verification</a>
              <p>If you can't click the link above, you can copy/paste the following link into your browser: ${linkApi}/api/v1/users/auth/verify?email=${destination}&token=${token}</p>
              
              <p>For security, the link will only be active for 24 hours. after 24 hours, you need to register again.</p>
              
              <p>If you have any other problems, or need additional support, please don't hesitate to contact us by email at support@zwallets.com</p>
              
              <p>See you out on the Zwallet!</p>
              
              <p>Copyright © 2021 Zwallet , All rights reserved</p
              </div>
          </body>
          </html>
          `
        });
        // Click this link to verify your account : <a href="${linkApi}/api/v1/users/auth/verify?email=${destination}&token=${token}">Activate</a>`,
        resolve(info);
      } else if (type === "forgot") {
        const info = await transporter.sendMail({
          from: email,
          to: destination,
          subject: "Zwallet: Password Reset",
          html: `<!DOCTYPE html>
          <html lang="en">
          <head>
          <meta charset="UTF-8">
          <meta http-equiv="X-UA-Compatible" content="IE=edge">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Document</title>
          <style>
          .container{
              border: 5px;
              
          }
          </style>
          </head>
          <body>
              <div class="container">
              <h1>Forgot your password?</h1>
              <h2>Create a new Account password and get back to the action!</h2>
              <p>Hi there,<p>
              
              <p>We've received a password reset request for user ${destination}. If you made this request, please click here to continue to reset your password. This link will expire in one hour.</p>
              <a href="${link}/auth/reset-password/${destination}/${token}">Reset Password</a>
              <p>If you can't click the link above, you can copy/paste the following link into your browser: ${link}/auth/reset-password/${destination}/${token}</p>
              
              <p>If you did not request a password reset, simply take no action, and this request will expire.</p>
              
              <p>If you have any other problems, or need additional support, please don't hesitate to contact us by email at support@Zwallet.com</p>
              
              <p>See you out on the Zwallet!</p>
              
              <p>Copyright © 2021 Zwallet, All rights reserved</p
              </div>
          </body>
          </html>`
        });
        // Click this link to reset your password : <a href="${link}/auth/reset-password/${destination}/${token}">Reset Password</a>`,
        resolve(info);
      }
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  send,
};

const nodemailer = require('nodemailer');
const { logError } = require('./logger');

const {
  MAIL_HOST,
  MAIL_PORT,
  MAIL_USER,
  MAIL_PASSWORD,
  MAIL_FROM_EMAIL,
  WEB_APP_URL,
} = process.env;

const MAILER_FROM = `Avocado Guild <${MAIL_FROM_EMAIL}>`;

var transport = nodemailer.createTransport({
  host: MAIL_HOST,
  port: MAIL_PORT,
  secure: true,
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASSWORD
  }
});

/**
 * Send an email to verify new user
 * @param {String} email 
 * @param {String} verifyEmailToken 
 * @returns url link to verify new user
 */
const verifyEmailMail = async (email, verifyEmailToken) => {
  const mailOptions = {
    from: MAILER_FROM,
    to: email,
    subject: "Please verify your email address",
    html: `<html>
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Avocado verify email</title>
            </head>
            <body style="margin: 0; font-family: Verdana; font-size: 18px;">
              <table width="100%" height="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #ededed; padding: 60px;">
                    <table width="1110px" cellspacing="0" cellpadding="0" align="center" valign="center" style="max-width: 1110px;">
                      <tr>
                        <td align="center" valign="center">
                          
                          <!-- WHITE BACKGROUND CONTAINER -->
                          <table width="100%" height="600px" cellspacing="0" cellpadding="0" style="background-color: white;max-height: 600px;">
                            <tr>
                              <td align="center" style="padding: 65px 125px;">
                                <table width="100%" cellspacing="0" cellpadding="0" align="center" valign="center" style="text-align: center;">
                                  <tr>
                                    <td>
                                      <!-- LOGO -->
                                      <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="342px">
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 35px; padding-top: 60px; color: #1E2936;">
                                      <!-- TITLE -->
                                      Verify your email address
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 24px;color: #91999F; padding: 45px 0 40px;">
                                      <!-- TEXT -->
                                      Please confirm that you want to use this email as your Avocado account
                                      email address. Once it’s done you will be able to login to your dashboard!
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <!-- UPDATE THE LINK HERE, ON HREF -->
                                      <a href="${WEB_APP_URL}/auth/verify-email/${verifyEmailToken}" target="_blank">
                                        <button style="background-color: #39BA96; width: 480px; padding: 15px; border: 0; color: #ECEDEE; font-size: 24px; cursor: pointer;">
                                          Verify My Email
                                        </button>
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="color: #91999F; padding: 45px 0 10px;">
                                      Or paste this link into your browser:
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <!-- UPDATE THE LINK HERE, BOTH HREF AND TEXT -->
                                      <a href="${WEB_APP_URL}/auth/verify-email/${verifyEmailToken}" target="_blank">
                                        ${WEB_APP_URL}/auth/verify-email/${verifyEmailToken}
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 25px;">
                          <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="text-align: center;">
                            <tr>
                              <td>
                                <!-- LOGO -->
                                <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="170px">
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 12px; color: #91999F;">
                                <!-- COPY RIGHT -->
                                &copy; 2022 Avocado. All rights reserved.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
  };

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logError(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

/**
 * Send an email to verify new user
 * @param {String} email 
 * @param {String} verificatoinCode 
 * @returns url link to verify new user
 */
const sendVerificationCodeMail = async (email, verificationCode) => {
  const mailOptions = {
    from: MAILER_FROM,
    to: email,
    subject: "Update email verification code",
    html: `<html>
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Avocado verify email</title>
            </head>
            <body style="margin: 0; font-family: Verdana; font-size: 18px;">
              <table width="100%" height="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #ededed; padding: 60px;">
                    <table width="1110px" cellspacing="0" cellpadding="0" align="center" valign="center" style="max-width: 1110px;">
                      <tr>
                        <td align="center" valign="center">
                          
                          <!-- WHITE BACKGROUND CONTAINER -->
                          <table width="100%" height="600px" cellspacing="0" cellpadding="0" style="background-color: white;max-height: 600px;">
                            <tr>
                              <td align="center" style="padding: 65px 125px;">
                                <table width="100%" cellspacing="0" cellpadding="0" align="center" valign="center" style="text-align: center;">
                                  <tr>
                                    <td>
                                      <!-- LOGO -->
                                      <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="342px">
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 35px; padding-top: 60px; color: #1E2936;">
                                      <!-- TITLE -->
                                      Verification Code
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 24px;color: #91999F; padding: 45px 0 40px;">
                                      <!-- TEXT -->
                                      Please use the verification code below to update your email.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td align="center">
                                      <div style="font-size: 30px; background-color: #39BA96; width: 200px; padding: 15px; border: 0; color: #ECEDEE;">
                                        <!-- UPDATE THE OTP CODE HERE -->
                                        ${verificationCode}
                                      </div>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="color: #91999F; padding: 45px 0 10px;">
                                      If you didn’t request to update your email, please ignore this email.
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 25px;">
                          <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="text-align: center;">
                            <tr>
                              <td>
                                <!-- LOGO -->
                                <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="170px">
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 12px; color: #91999F;">
                                <!-- COPY RIGHT -->
                                &copy; 2022 Avocado. All rights reserved.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`
  ,
  };

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logError(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

/**
 * Send an email to verify new user
 * @param {String} email 
 * @param {String} verifyEmailToken 
 * @returns url link to verify new user
 */
const verifyVerificationCodeMail = async (email, verifyEmailToken) => {
  const mailOptions = {
    from: MAILER_FROM,
    to: email,
    subject: "Please verify your email address",
    html: `<html>
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Avocado verify email</title>
            </head>
            <body style="margin: 0; font-family: Verdana; font-size: 18px;">
              <table width="100%" height="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #ededed; padding: 60px;">
                    <table width="1110px" cellspacing="0" cellpadding="0" align="center" valign="center" style="max-width: 1110px;">
                      <tr>
                        <td align="center" valign="center">
                          
                          <!-- WHITE BACKGROUND CONTAINER -->
                          <table width="100%" height="600px" cellspacing="0" cellpadding="0" style="background-color: white;max-height: 600px;">
                            <tr>
                              <td align="center" style="padding: 65px 125px;">
                                <table width="100%" cellspacing="0" cellpadding="0" align="center" valign="center" style="text-align: center;">
                                  <tr>
                                    <td>
                                      <!-- LOGO -->
                                      <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="342px">
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 35px; padding-top: 60px; color: #1E2936;">
                                      <!-- TITLE -->
                                      Verify your email address
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 24px;color: #91999F; padding: 45px 0 40px;">
                                      <!-- TEXT -->
                                      Please confirm that you want to use this email as your Avocado account
                                      email address. Once it’s done you will be able to login to your dashboard!
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <!-- UPDATE THE LINK HERE, ON HREF -->
                                      <a href="${WEB_APP_URL}/auth/verify?emailToken=${verifyEmailToken}" target="_blank">
                                        <button style="background-color: #39BA96; width: 480px; padding: 15px; border: 0; color: #ECEDEE; font-size: 24px; cursor: pointer;">
                                          Verify My Email
                                        </button>
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="color: #91999F; padding: 45px 0 10px;">
                                      Or paste this link into your browser:
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <!-- UPDATE THE LINK HERE, BOTH HREF AND TEXT -->
                                      <a href="${WEB_APP_URL}/auth/verify?emailToken=${verifyEmailToken}" target="_blank">
                                      ${WEB_APP_URL}/auth/verify?emailToken=${verifyEmailToken}
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 25px;">
                          <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="text-align: center;">
                            <tr>
                              <td>
                                <!-- LOGO -->
                                <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="170px">
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 12px; color: #91999F;">
                                <!-- COPY RIGHT -->
                                &copy; 2022 Avocado. All rights reserved.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
  };

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logError(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

/**
 * Send an email to create new password
 * @param {String} scholarEmail 
 * @param {String} resetPasswordToken 
 * @returns url link to create new password
 */
const resetPasswordMail = async (scholarEmail, resetPasswordToken) => {
  const mailOptions = {
    from: MAILER_FROM,
    to: scholarEmail,
    subject: "Reset Password Confirmation",
    html: `<html>
            <head>
              <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Avocado verify email</title>
            </head>
            <body style="margin: 0; font-family: Verdana; font-size: 18px;">
              <table width="100%" height="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="background-color: #ededed; padding: 60px;">
                    <table width="1110px" cellspacing="0" cellpadding="0" align="center" valign="center" style="max-width: 1110px;">
                      <tr>
                        <td align="center" valign="center">
                          
                          <!-- WHITE BACKGROUND CONTAINER -->
                          <table width="100%" height="600px" cellspacing="0" cellpadding="0" style="background-color: white;max-height: 600px;">
                            <tr>
                              <td align="center" style="padding: 65px 125px;">
                                <table width="100%" cellspacing="0" cellpadding="0" align="center" valign="center" style="text-align: center;">
                                  <tr>
                                    <td>
                                      <!-- LOGO -->
                                      <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="342px">
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 35px; padding-top: 60px; color: #1E2936;">
                                      <!-- TITLE -->
                                      Forgot your Password?
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="font-size: 24px;color: #91999F; padding: 45px 0 40px;">
                                      <!-- TEXT -->
                                      A request has been receive to change the password for your Avocado account.
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <!-- UPDATE THE LINK HERE, ON HREF -->
                                      <a href="${WEB_APP_URL}/auth/reset-password/${resetPasswordToken}" target="_blank">
                                        <button style="background-color: #39BA96; width: 480px; padding: 15px; border: 0; color: #ECEDEE; font-size: 24px; cursor: pointer;">
                                          Reset Password
                                        </button>
                                      </a>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td style="color: #91999F; padding: 45px 0 10px;">
                                      If you did not initiate this request, please contact us immediately at
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <!-- UPDATE THE LINK HERE, BOTH HREF AND TEXT. MAILTO:<EMAIL> -->
                                      <a href="mailto:support@avodadodao.io" target="_blank">
                                        support@avodadodao.io
                                      </a>
                                    </td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td align="center" style="padding: 25px;">
                          <table width="100%" height="100%" cellspacing="0" cellpadding="0" style="text-align: center;">
                            <tr>
                              <td>
                                <!-- LOGO -->
                                <img src="https://avocado.9accounts.com/images/icon/logo.png" alt="logo" width="170px">
                              </td>
                            </tr>
                            <tr>
                              <td style="padding-top: 12px; color: #91999F;">
                                <!-- COPY RIGHT -->
                                &copy; 2022 Avocado. All rights reserved.
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </body>
          </html>`,
  };

  await transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return logError(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

const mailer = {
  verifyEmailMail,
  resetPasswordMail,
  sendVerificationCodeMail,
  verifyVerificationCodeMail
}

module.exports = mailer

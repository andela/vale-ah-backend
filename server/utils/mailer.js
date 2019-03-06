import sendgrid from '@sendgrid/mail';
import env from '../config/env-config';

const { ADMIN_EMAIL, SITE_NAME } = env;

sendgrid.setApiKey(env.SENDGRID_KEY);

/**
 * Returns an HTML fragment with passed body
 * @param {string} body Document body
 * @returns {string} HTML fragment
 */


/**
   * Sends a verification link to a newly signed up user
   * @param {string} email Recipient email address
   * @param {string} verificationLink Account verification link
   * @returns {Promise} Sendgrid response
   */

const sendVerificationMail = (email, verificationLink) => {
  const mailBody = `
    <div style="
      padding: 10px;
      background: #F3F3F3;
      border: 5px double #522D16;
      text-align: center;
    ">
      <h1 style="
      ">${SITE_NAME}</h1>
      <p>Activate your ${SITE_NAME} account by clicking the button below</p>
      <a style="
        text-decoration: none;
        margin-top: 30px;
        padding: 15px 20px;
        background: #522D16;
        text-align: center;
        display: inline-block;
        color: white;" 
        href=${verificationLink} target="_blank">Verify Your Email</a>
    </div>
  `;
  const mail = {
    to: email,
    from: ADMIN_EMAIL,
    subject: `Welcome to ${SITE_NAME}`,
    text: `Please follow this link to activate your ${SITE_NAME} account:   ${verificationLink}`,
    html: mailBody,
  };


  return sendgrid.send(mail);
};

export default {
  sendVerificationMail
};

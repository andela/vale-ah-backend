import sendgrid from '@sendgrid/mail';
import env from '../config/env-config';
import { verificationEmailMessage } from './helpers';

const { ADMIN_EMAIL, SITE_NAME, SENDGRID_KEY } = env;

sendgrid.setApiKey(SENDGRID_KEY);

/**
 * Sends a verification link to a newly signed up user
 * @param {string} email Recipient email address
 * @param {string} verificationLink Account verification link
 * @returns {Promise} Sendgrid response
 */

const sendVerificationMail = (email, verificationLink) => {
  const mail = {
    to: email,
    from: ADMIN_EMAIL,
    subject: `Welcome to ${SITE_NAME}`,
    text: `Please follow this link to activate your ${SITE_NAME} account:   ${verificationLink}`,
    html: verificationEmailMessage(SITE_NAME, verificationLink)
  };

  return sendgrid.send(mail);
};

export default {
  sendVerificationMail
};

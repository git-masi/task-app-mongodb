const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: 'taskapp@nodejscourse.com',
    subject: 'Thanks for signing up',
    text: `Hi ${name}, thanks for signing up!`
  });
};

const sendCancelEmail = (name, email) => {
  sgMail.send({
    to: email,
    from: 'taskapp@nodejscourse.com',
    subject: 'Goodbye for now',
    text: `We're sorry to see you go ${name}. We hope you come back and join us again some day.`
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancelEmail
}
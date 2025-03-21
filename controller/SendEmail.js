const nodemailer = require("nodemailer");
const { Verification_Email_Template, Welcome_Email_Template, RECIVE_NEW_ORDER, CANCLE_EMAIL_TEMPLATE } = require("./EmailTemplate");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "saddamanwarllc@gmail.com",
    pass: "sdkn pfzh ysuh icxq",
  },
});

const handleSendEmail = async(email, verificationCode) => {
        await transporter.sendMail({
        from: "From Food Delivery Service,'<saddamanwarllc@gmail.com>'", // sender address
        to: email, // list of receivers
        subject: "Verify Your Email", // Subject line
        text: "Verify Your Email", // plain text body
        html: Verification_Email_Template.replace("{verificationCode}", verificationCode), // html body
      });
}

const handleWelcomeEmail = async(email, name) => {
      await transporter.sendMail({
      from: "From food delivery service,'<saddamanwarllc@gmail.com>'", // sender address
      to: email, // list of receivers
      subject: "Welcome To our Food Delivery Service", // Subject line
      text: "Welcome To our Food Delivery Service", // plain text body
      html: Welcome_Email_Template.replace("{name}", name), // html body
    });
}

const handleOrderPlacedEmail = async(item) => {
  await transporter.sendMail({
  from: "From food delivery service,'<saddamanwarllc@gmail.com>'", // sender address
  to: 'saddamanwarllc@gmail.com', // list of receivers
  subject: "you recive a new Order", // Subject line
  text: "You Recive New Order", // plain text body
  html: RECIVE_NEW_ORDER.replace("{item}", item), // html body
});
}

const handleCancelOrderEmail = async(name) => {
  await transporter.sendMail({
  from: "From food delivery service,'<saddamanwarllc@gmail.com>'", // sender address
  to: 'saddamanwarllc@gmail.com', // list of receivers
  subject: `User ${name} Cancelled the Order`, // Subject line
  text: `User ${name} Cancelled the Order`, // plain text body
  html: CANCLE_EMAIL_TEMPLATE.replace("{name}", name), // html body
});
}
 

module.exports = {handleSendEmail, handleWelcomeEmail, handleOrderPlacedEmail, handleCancelOrderEmail}
import nodemailer from "nodemailer";
import catchAsync from "./catchAsync.js";

const sendEmail = catchAsync(async (options) => {
  //1 create a transponder

  const transponder = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2 define email options
  const mailOptions = {
    from: "whizoid blogs <bibinthomas951@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //3 send email
  await transponder.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });
});

export default sendEmail;

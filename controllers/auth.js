import jwt from "jsonwebtoken";
import Author from "../models/User.js";
import AppError from "../utils/error.js";
import catchAsync from "../utils/catchAsync.js";
import sendEmail from "../utils/email.js";
import crypto from "crypto";

const signToken = (id) =>
  jwt.sign({ id }, process.env.ACCESS_SECRET_KEY, {
    expiresIn: "5d",
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOption = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") cookieOption.secure = true;

  res.cookie("jwt", token, cookieOption);

  // Remove password from output
  user.password = undefined;
  user.passwordChangedAt = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

/* LOGGING IN */
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //if email and password exists
  if (!email || !password) {
    return next(new AppError("please provide the valid credientials", 400));
  }

  //checking data in database
  const existingAuthor = await Author.findOne({ email }).select("+password");
  if (
    !existingAuthor ||
    !(await existingAuthor.correctPassword(password, existingAuthor.password))
  )
    return next(new AppError("Invalid email or password", 401));

  createSendToken(existingAuthor, 200, res);
});

/* Update password */
export const updatePassword = catchAsync(async (req, res, next) => {
  //get user from the collections
  const user = await Author.findById(req.author._id).select("+password");

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //send jwt token

  createSendToken(user, 200, res);
});

//functionality to be removed and to keep for later

/* REGISTER USER */
export const register = catchAsync(async (req, res, next) => {
  const newAuthor = await new Author({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  }).save();

  createSendToken(newAuthor, 201, res);
});

// /* Forgot password */
// export const forgotPassword = catchAsync(async (req, res, next) => {
//   //1)get user based on email
//   const user = await Author.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new AppError("There is no user with email address.", 404));
//   }

//   // 2) Generate the random reset token
//   const resetToken = user.createPasswordResetToken();
//   await user.save({ validateBeforeSave: false });

//   //3) send back as a email
//   const resetUrl = `${req.protocol}://${req.get(
//     "host"
//   )}/auth/resetPassword/${resetToken}`;

//   const message = `Forgot your password ? submit a patch request with your new password and password confirm to ${resetUrl}.\n if you didn't forget your password, please ignore this email!`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: "Your password reset token (valid for 10mins)",
//       message,
//     });

//     res.status(200).json({
//       status: "success",
//       message: "token sent to email",
//     });
//   } catch (err) {
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(
//       new AppError(
//         "Some error occurred while sending the email please try again later !",
//         500
//       )
//     );
//   }
// });

// /* Reset password */
// export const resetPassword = catchAsync(async (req, res, next) => {
//   // 1) Get user based on the token
//   const hashedToken = crypto
//     .createHash("sha256")
//     .update(req.params.token)
//     .digest("hex");

//   const user = await Author.findOne({
//     passwordResetToken: hashedToken,
//     passwordResetExpires: { $gt: Date.now() },
//   });

//   // 2) If token has not expired, and there is user, set the new password
//   if (!user) {
//     return next(new AppError("Token is invalid or has expired", 400));
//   }

//   user.password = req.body.password;
//   user.passwordConfirm = req.body.passwordConfirm;
//   user.passwordResetToken = undefined;
//   user.passwordResetExpires = undefined;
//   await user.save();

//   // 3) Update changedPasswordAt property for the user
//   // 4) Log the user in, send JWT
//   createSendToken(user, 200, res);
// });

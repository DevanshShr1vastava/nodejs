import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/error.js";
import author from "../models/User.js";
import { promisify } from "util";
export const verifyToken = catchAsync(async (req, res, next) => {
  let token;
  //getting the token from the request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  //checking if the user token exists
  if (!token) {
    return next(new AppError("Unauthorized", 401));
  }

  //verfication
  const decoded = await promisify(jwt.verify)(
    token,
    process.env.ACCESS_SECRET_KEY
  );
  //checking weather the users exists with that id in the database
  const currentUser = await author.findById(decoded.id);
  if (!currentUser) return next(new AppError("invalid User", 401));

  //check if the user changed the password
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError("Changed password! please login!", 401));
  }

  req.author = currentUser;
  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.author.role))
      return next(
        new AppError("you dont have access to perform this action", 403)
      );

    next();
  };

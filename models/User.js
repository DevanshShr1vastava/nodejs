import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import crypto from "crypto";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: "String",
      required: [true, "please tell us your name!"],
    },
    email: {
      type: "String",
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "please provide a valid email "],
    },
    about: "String",
    photo: "String",
    role: {
      type: String,
      enum: ["admin", "guest"],
      default: "guest",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false, // will hide it in the response send back
    },

    passwordConfirm: {
      type: String,
      required: [true, "Please Confirm the password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not same",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);
//hashing the password before save
authorSchema.pre("save", async function (next) {
  //only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 14); //password,cost of 25
  this.passwordConfirm = undefined;
  next();
});

//to change the password changed time in the documnet
//if the document is not modified or new skip else changeg the time to the present time
authorSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) {
    return next();
  }
  //to avoid the issues with the jwt token creation the jwt token is created a bit faster than writing data into db so we reduce a sec to try to sync with it
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//return only document which is set to true
authorSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

//checking the password with provided one
authorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

authorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  //not changed
  return false;
};
authorSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  console.log(resetToken, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("Author", authorSchema);

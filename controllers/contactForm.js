import contactForm from "../models/contactForm.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/error.js";
import sendEmail from "../utils/email.js";

export const newForm = catchAsync(async (req, res, next) => {
  const newPost = new contactForm(req.body);
  await newPost.save();
  sendEmail({
    subject: req.body.subject,
    email: req.body.email,
    subject: req.body.subject,
    html: `<html>
    <p>from ${req.body.name} </p>
    <p>email: ${req.body.email}</p>
    <p>message: ${req.body.message}</p>
    <p>Interest: ${req.body.interest}</p>
    <p>Source: ${req.body.source}</p>
  </html>`,
  });
  res.status(201).json({
    status: "success",
    data: {
      status: "success",
    },
  });
});

export const getForms = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(contactForm.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const data = await features.query;

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

export const getRecentForms = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(
    contactForm.find().sort({ _id: -1 }).limit(4),
    req.query
  );
  const data = await features.query;
  res.status(200).json({
    status: "Success",
    results: data.length,
    data,
  });
});

export const deleteForm = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await contactForm.deleteOne({ _id: id });
  if (!deleteData) {
    return next(new AppError("No data found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: deleteData,
  });
});

export const getFormById = catchAsync(async (req, res, next) => {
  const singleForm = await contactForm.findById(req.params.id);

  if (!singleForm) {
    return next(new AppError("No data found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: {
      post: singleForm,
    },
  });
});

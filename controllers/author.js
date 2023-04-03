import Authors from "../models/blogAuthors.js";

import catchAsync from "../utils/catchAsync.js";

import AppError from "../utils/error.js";

export const createAuthor = catchAsync(async (req, res, next) => {
  const newAuthor = new Authors(req.body);
  await newAuthor.save();
  res.status(201).json({
    status: "Success",
    data: {
      author: newAuthor,
    },
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const data = await Authors.find();
  res.status(200).json({
    status: "Success",
    results: data.length,
    data,
  });
});

export const updateAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const update = { $set: req.body };
  const data = await Authors.findByIdAndUpdate({ _id: id }, update, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(new AppError("No data found with that ID", 404));
  }
  return res.status(200).json({
    status: "Success",
    data: {
      author: data,
    },
  });
});

export const deleteAuthor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await Authors.deleteOne({
    _id: id,
  });
  if (!deleteData) {
    return next(new AppError("No data found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: deleteData,
  });
});

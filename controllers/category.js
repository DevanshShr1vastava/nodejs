import Category from "../models/category.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/error.js";

export const createCategory = catchAsync(async (req, res, next) => {
  const newCategory = new Category(req.body);
  await newCategory.save();
  res.status(201).json({
    status: "Success",
    data: {
      category: newCategory,
    },
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const data = await Category.find();

  res.status(200).json({
    status: "success",
    results: data.length,
    data,
  });
});

export const updateCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const update = { $set: req.body };

  const data = await Category.findByIdAndUpdate({ _id: id }, update, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(new AppError("No data found with that ID", 404));
  }
  return res.status(200).json({
    status: "Success",
    data: {
      post: data,
    },
  });
});

export const deleteCategory = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await Category.deleteOne({ _id: id });
  if (!deleteData) {
    return next(new AppError("No Data found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: deleteData,
  });
});

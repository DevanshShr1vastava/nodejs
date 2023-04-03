import BlogPost from "../models/blogPost.js";
import APIFeatures from "../utils/apiFeatures.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/error.js";

export const createPost = catchAsync(async (req, res, next) => {
  const newPost = new BlogPost(req.body);
  await newPost.save();
  res.status(201).json({
    status: "success",
    data: {
      post: newPost,
    },
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(BlogPost.find(), req.query)
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

export const getById = catchAsync(async (req, res, next) => {
  const singleBlog = await BlogPost.findById(req.params.id);

  if (!singleBlog) {
    return next(new AppError("No data found with that ID", 404));
  }
  res.status(200).json({
    status: "Success",
    data: {
      post: singleBlog,
    },
  });
});

export const updateBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const update = { $set: req.body };

  const data = await BlogPost.findByIdAndUpdate({ _id: id }, update, {
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

export const deleteBlog = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleteData = await BlogPost.deleteOne({ _id: id });

  if (!deleteData) {
    return next(new AppError("No data found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: deleteData,
  });
});

export const featuredPost = catchAsync(async (req, res, next) => {
  req.query.featured = true;
  next();
});

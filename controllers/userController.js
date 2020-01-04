const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(500).json({
    status: 'error',
    results: users.length,
    data: {
      users
    }
  });
});
exports.updateArticle = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'message'
  });
};
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'message'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'message'
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'message'
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'message'
  });
};

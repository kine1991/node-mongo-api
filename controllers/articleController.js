const Article = require('../models/articleModel');

exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    res.status(200).json({
      status: 'success',
      results: articles.length,
      data: {
        articles: articles
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'err'
    });
  }
};

exports.getArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        article: article
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        article: article
      }
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

exports.createArticle = async (req, res) => {
  try {
    console.log(req.body);
    // const newArticle = new Article({});
    // newArticle.save();
    const newArticle = await Article.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        article: newArticle
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      data: {
        message: 'Invalid data set'
      }
    });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: error
    });
  }
};

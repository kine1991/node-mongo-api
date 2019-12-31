const fs = require('fs');

const articles = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);
  if (req.params.id * 1 > articles.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    });
  }
  next();
};

exports.getAllArticles = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: articles.length,
    data: {
      articles: articles
    }
  });
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price'
    });
  }
  next();
};

exports.getArticle = (req, res) => {
  console.log(req.params);
  const id = req.params.id * 1;

  const article = articles.find(el => el.id === id);
  res.status(200).json({
    status: 'success',
    data: {
      article: article
    }
  });
};

exports.updateArticle = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      article: '<Updated tour here...>'
    }
  });
};

exports.createArticle = (req, res) => {
  const newId = articles[articles.length - 1].id + 1;
  const newArticle = Object.assign({ id: newId }, req.body);

  articles.push(newArticle);

  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(articles),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          article: newArticle
        }
      });
    }
  );
  res.send('fdfd');
};

exports.deleteArticle = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

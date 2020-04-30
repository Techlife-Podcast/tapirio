const cors = require('cors')
const express = require('express');
const router = express.Router();
const MarkdownBlog = require('../scripts/app.functions');
const blog = new MarkdownBlog('./content/articles/');
const blogInfo = blog.info;
blog.init().then(() => blog.sortBy({ property: "date", asc: false }));

//var arr = [{name:"John"},{name:"Bob"},{name:"abc"},{name:"bac"}];

router.get('/', function (req, res, next) {
  const articles = blog.posts;
  res.render('index', { articles, blogInfo, path: req.path });
});

router.get('/about', (req, res) => {
  res.render('about', { blogInfo, path: req.path });
});

router.get('/contact', (req, res) => {
  res.render('contact', { blogInfo, path: req.path });
});

router.get('/blog', async (req, res) => {
  const articles = blog.posts;
  res.render('blog', { articles, blogInfo, path: req.path });
});

router.route('/api/search').get(cors(), async (req, res) => {
  const search = req.query.name.toLowerCase()
  if (search) {
    results = articles.filter((a) => (a.title + a.description + a.author).toLowerCase().includes(search));
    console.log(search, results)
  } else {
    results = []
  }
  res.json(results)
})

router.get('/blog/:filename', async (req, res) => {
  const slug = req.params.filename;
  const postMetaData = blog.getPostMetadata(slug);

  if (!postMetaData) {
    res.render('blog-not-found', slug);
    return;
  }

  res.render('article', Object.assign({},
    { postMetaData },
    { blogInfo },
    {
      content: blog.renderMarkdown(slug),
      path: req.path,
      layout: 'blog',
      isBlog: true,
      isBlogPost: true
    }
  ));
});

module.exports = router;

var express = require('express');
var router = express.Router();

const initial = require('./initial');
const addcollections = require('./addcollections');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Insert Csv to Mongo' });
});

router.get('/initial', initial.getAccessDB);
router.get('/addcollections', addcollections.addcollections);


module.exports = router;

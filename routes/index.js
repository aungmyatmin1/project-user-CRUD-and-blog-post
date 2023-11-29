var express = require('express');
var router = express.Router();


var schema = require('../models/schema')


/* GET home page. */
router.get('/', async (req, res) =>{
  var sessionS = req.session;
  var post = schema.post;

  var showData = await post.find({}).then ((postData)=>{
    res.render('index', {title : 'BLOG POST', posts: postData, loggedIn: sessionS.loggedIn})
    
    }).catch((error)=>{
      console.log(error)
    
  })


});

router.get('/logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/');

})

router.post('/q', async (req,res)=>{
  var sessionS = req.session;
  var post = schema.post;
  var q = req.body.searchInput;
  var qry = {title: {$regex:'^'+q, $options:'i'}}

  if(q != null){
  var showData = await post.find(qry).then ((postData)=>{
     posts = postData;
  })} else{
    q = 'Search';
    var showData = await post.find({}).then ((postData)=>{
      posts = postData;
    })
  }
  res.render('index', {title: 'Search Result', posts: posts , loggedIn: sessionS.loggedIn})

})

module.exports = router;

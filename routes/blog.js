var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var schema = require('../models/schema')

/* GET home page. */
router.get('/', function(req, res, next) {
    let sessionS = req.session;
  res.render('index', { title: 'BLOG POST',loggedIn: false});
});

//edit
router.get('/:id', async (req,res)=>{
    let sessionS = req.session;

    if(!sessionS.loggedIn){
        res.render('blog', { title : 'Edit', loggedIn: sessionS.loggedIn, error: ' Invalid Request'})
    } else {
        let id = req.params.id;
        err = '';

        let post = schema.post;
        let qry = {_id:id};
        let postR = await post.find(qry).then((data)=>{
            if(data == null ){
                err = 'Invalid ID';
            }
            res.render('blog', {title: 'Edit', element :data, loggedIn: false  , error : err})
        })
    }
})

router.post('/save', async (req,res)=>{
    let sessionS = req.session;

    if(!sessionS.loggedIn){
        res.redirect('login')
    } else {
        let updateid = req.body.updateid; 
        let title = req.body.title;
        let body = req.body.body;
        let post = schema.post;
        let qry= {_id:updateid}

        let saveData = {
            $set: {
                title : title,
                body : body

            }
        }
        let updatePost = await post.updateOne(qry, saveData)

        res.redirect('/')
    }
})



//delete
router.get('/delete/:id', async (req,res)=>{
    let sessoinS = req.session;

    if(!sessoinS.loggedIn){
        res.redirect('/')
    } else {
        let post = schema.post;
        let postId = req.params.id;
        let qry = {_id: postId};
        let deleteP = await post.deleteOne(qry);
        res.redirect('/');
    }
})
//post new
router.post('/new', async(req,res)=>{
    let sessionS = req.session;
    if (!sessionS.loggedIn){
        res.redirect('/login')
    } else { 
    let title = req.body.title;
    let body = req.body.body;
    let post = schema.post;
    let err = '';
    // find Title
    let ctitle = {title: title}
    let findctitle = await post.findOne(ctitle).then(async(data)=>{
        if(data){
            res.render('/', {title: 'Exits', alert:'Data is exit' })
         
            }else{
            let newPost = new post({
                title : title,
                body : body
            });
            let savePost = await newPost.save();
        }
        
    })
    res.redirect('/');
}
})

module.exports = router;

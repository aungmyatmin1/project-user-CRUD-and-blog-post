var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt')
var schema = require('../models/schema')
var bodyParser = require('body-parser')

/* GET users listing. */
router.get('/', (req, res) =>{
  res.render('login',{title:'Login', loggedIn: false, error: null});
});

router.get('/new-acc', (req, res) =>{
  res.render('new-acc',{title:'Create Account', loggedIn: false, error : null});
});

//crate user
router.post('/new', async (req,res)=>{
  let email = req.body.emailInput;
  let pwd = req.body.pwd;

  if (email != '' && pwd != ''){
    let user = schema.user;
    let qry = {email: email}
    let userS = await user.findOne(qry).then (async (data)=>{
      if(!data){
        let saltRounds = 10;
        let passSalt = await bcrypt.genSalt(saltRounds, async (err, salt)=>{
          let passHash =  await bcrypt.hash(pwd, salt, async (err, hash)=>{
            let account = {email : email, pwd : hash, level : 'user'};
            let newUser = new schema.user(account);
            let saveUser = await newUser.save();
          })
        }) 
      } else{
        res.render('login', {title : 'login', loggedIn:false, error:'Already Exits'})
      }
      
      
    });
    res.render('login', {title: 'login', loggedIn: false, error:'Please Login With Your New Account'}) 
    
  } else {
    res.render('new-acc', {title: 'New Account', loggedIn: false, error: 'ALL Field Required'})
  }
})

//login

router.post('/', async (req,res)=>{
  let email = req.body.emailInput;
  let pwd = req.body.pwd;

  let loginSuccess = false;

  let sessionS = req.session;
  sessionS.loggedIn = false;

  let user = schema.user;
  let qry = {email:email}

  if(email != '' && pwd != ''){
    let userS = await user.findOne(qry).then( async (data)=>{
      if (data){
        let pwdR = await bcrypt.compare(pwd, data.pwd).then((isMatch)=>{
          if(isMatch){
          sessionS.loggedIn = true;
          loginSuccess = true;
          } 
        })
      } 
    })
  }
  if (loginSuccess === true){
    res.redirect('/');
  } else {
    res.render('login', {title: 'login', loggedIn:false, error: 'User Name or Password is Incorrect! Invalid Login'})
  }

})



module.exports = router;

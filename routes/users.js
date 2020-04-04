const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User,Chat} = require('../models/user');
const url = require('url');

 //Get
 router.get('/', (req,res)=> res.render('login'));
 router.get('/Signup',(req,res)=>res.render('register'));
 router.get('/chat',(req,res)=>
 {
     if(req.query.user_id == null)return res.redirect("/");
     res.render('chat',{user_id:req.query.user_id});
 });
 

 //Post
router.post('/user/register',async (req,res)=>{
    //const {error} = validate(req.body);
    //if(error) return res.status(400).send(error.details[0].message);
    let user = await User.findOne({email: req.body.email});
    if(user) return res.status(400).send('Email Already registered.');
    let userObject = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.pass
    });
    const salt = await bcrypt.genSalt(10);
    userObject.password = await bcrypt.hash(userObject.password,salt);
    await userObject.save();
    res.redirect('/');
});

router.post('/user/login',async (req,res)=>{
    let user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('This Email is not Registered');
    const validPass = await bcrypt.compare(req.body.pass,user.password);
    if(!validPass) return res.status(400).send('Invalid Email or Password');
    if(user.isOnline)return res.status(400).send('Logged in from other device');
    User.updateOne({email: req.body.email}, {$set:{isOnline: true}},(err)=>{
        if(err)return res.sendStatus(400).send("Something went wrong while updating");
    });
    res.redirect(url.format({
        pathname: "/chat",
        query:{
            "user_id" : ""+user._id+"",
        }
    }));
});

module.exports = router;
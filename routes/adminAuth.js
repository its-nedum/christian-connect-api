const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//IMPORT MODEL
const Admins = require('../models/Admins')

//CREATE ADMIN ACCOUNT
router.post('/create-admin', async (req, res) => {
    //collect form data
    let {firstname, lastname, email, username, password, admin_type} = req.body;
    email = email.toLowerCase();
    username = username.toLowerCase()
    //Input validation
    if(!email || !username){
        return res.status(200).json({
            message: "Please enter all fields"
        })
    }
        //Check if the admin email already exist
        Admins.findOne({
            where: { email }
        }).then( (user) => {
            if(user){
                return res.status(200).json({
                    message: "Email already exists"
                })
            }else{
                //Check if username exist
                Admins.findOne({
                    where: { username }
                }).then( (nickname) => {
                    if(nickname){
                        return res.status(200).json({
                            message: "Username is taken"
                        })
                    }else{
                        //Hash the admin password
                        bcrypt.hash(password, 8).then(
                           (hash) => {
                               //Create the Admin account
                               Admins.create({
                                   firstname,
                                   lastname,
                                   email,
                                   username,
                                   password: hash,
                                   admin_type
                               }).then( (user) => {
                                   const name = firstname + ' ' + lastname;
                                   const userId = user.id;
                                   const token = jwt.sign({name, email, username, userId}, process.env.SECRET_TOKEN, {expiresIn: '7d'});
                                   res.status(201).json({
                                       status: "Admin account created successfully",
                                       data: user,
                                       token
                                   })
                               }).catch( (error) => {
                                    res.status(500).json({ error: 'Something went wrong, Please try again later..'}) 
                               })
                           } 
                        ).catch( (error) => {
                            res.status(500).json({ error: 'Something went wrong, Please try again later..'}) 
                       })
                    }
                }).catch( (error) => {
                    res.status(500).json({ error: 'Something went wrong, Please try again later..'}) 
               })
            }
        }).catch((error) => {
            res.status(500).json({
                error: "Something went wrong, please try again later"
            })
        })
  
})


//SIGN IN AN ADMIN
router.post('/signin-admin', async (req, res) => {
   let {email, password} = req.body
   email = email.toLowerCase();
    //If email and password is empty
   if(!email || !password){
    return res.status(400).json({
         message: 'All fields are required'
     })
    }

    //Verify admin email
    const emailChecked = /\S+@\S+\.\S+/.test(email);
    if(!emailChecked){
        return res.status(400).json({message: 'Please enter a valid email'})
    }
    //Check if admin account exists
    Admins.findOne({
        where: { email}
    }).then( (user) => {
        if(user == null){
            return res.status(400).json({
                message: 'The credentials you provided does not exist'
            })
        }else{
            //Compare password with DB
            let dbpassword = user.password;
            bcrypt.compare(password, dbpassword).then(
                (valid) => {
                    if(valid == false){
                        return res.status(400).json({message: 'The credentials you provided is incorrect'})
                    }
                    //Prepare JWT payload
                    const name = user.firstname + ' ' + user.lastname;
                    const username = user.username;
                    const userId = user.id;
                    jwt.sign({name, email, username, userId}, process.env.SECRET_TOKEN, {expiresIn: '7d'}, (err, token) => {
                        if(err) { console.log(err)}

                        res.status(200).json({
                            status: "success",
                            data: {
                                userId: user.id,
                                username: user.username,
                                token
                            }
                        })
                    })
                }
            ).catch( (error) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later"
                })
            })
        }
    }).catch( (error) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
 
})



module.exports = router;
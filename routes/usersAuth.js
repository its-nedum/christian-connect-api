const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Op = require('sequelize').Op;

//IMPORT DATABASE AND MODEL
const db = require('../database/sequelizeConnect')
const Users = require('../models/Users')

//test sequelize
// db.authenticate()
//     .then( () => console.log('Sequelize DB connected'))
//     .catch( (err) => console.log('Error: ' + err))

//USER REGISTER
router.post('/signup', async (req, res) => {
    let { firstname, lastname, email, username, password, telephone, state, gender, birthdate} = req.body;
    //Input validation
    if(!email || !username){
        return res.status(200).json({
            message: "Please enter all fields"
        })
    }
    //Check if email already exist
   Users.findOne({
        where: { email }
    }).then( (user) => {
        if(user){  
            return res.status(200).json({
                message: "Email already exists"
            })
        }else{
            //Check if username exist
            Users.findOne({
                where: { username }
            }).then( (username) => {
                if(username){
                    return res.status(200).json({
                        message: "Username is taken"
                    })
                }else{
                    //Hash the user password
                    bcrypt.hash(password, 8).then(
                        (hash) => {
                            //Create the user account
                            Users.create({
                                firstname,
                                lastname,
                                email,
                                username,
                                password: hash,
                                telephone,
                                state,
                                gender,
                                birthdate
                            }).then( (user) => {
                                const name = firstname + ' ' + lastname;
                                const token = jwt.sign({name, email, username}, process.env.SECRET_TOKEN, {expiresIn: '7d'})
                                res.status(201).json({
                                    status: 'User created successfully',
                                    data: user,
                                    token
                                })
                            }).catch( (err) => console.log(err))    
                        
                        }
                    ).catch( (error) => {
                        res.status(500).json({ error: 'Something went wrong, Please try again later..'})
                    })

                }
            }).catch( (err) => console.log(err))
        }
        
    }).catch( (err) => console.log(err))
    
})

//USER LOGIN
router.post('/signin', async (req, res) => {
    let { email, password} = req.body

    //Perform validation
    if(!email || !password){
       return res.status(400).json({
            message: 'All fields are required'
        })
    }

    //Verify user email
    const emailChecked = /\S+@\S+\.\S+/.test(email);
    if(!emailChecked){
        return res.status(400).json({message: 'Please enter a valid email'})
    }

    //Check if user account exists
    Users.findOne({
        where: { email }
    }).then( user => {
        if(user == null){
            return res.status(400).json({
                message: 'The credentials you provided does not exist'
            })
        }else{
           //Compare password with DB password
            let dbpassword = user.password;
            bcrypt.compare(password, dbpassword).then(
                (valid) => {
                    if(valid == false){
                        return res.status(400).json({message: 'The credentials you provided is incorrect'}) 
                    }
                    //Prepare JWT payload
                    let name = user.firstname + ' ' + user.lastname;
                    let username = user.username;
                    jwt.sign({name, email, username}, process.env.SECRET_TOKEN, {expiresIn: '7d'}, (err, token) => {
                        if(err) { console.log(err) }

                        res.status(200).json({
                            status: 'success',
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


    }).catch( (err) => console.log(err))


})

//USER UPDATE ACCOUNT

//USER UPDATE PASSWORD

module.exports = router
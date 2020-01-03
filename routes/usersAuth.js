const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload')
const Op = require('sequelize').Op;

//IMPORT DATABASE AND MODEL
const db = require('../database/sequelizeConnect')
const Users = require('../models/Users')

//SETUP CLOUDINARY
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

//SETUP FILEUPLOAD
router.use(fileUpload({
    useTempFiles: true
}))

//test sequelize
db.authenticate()
    .then( () => console.log('Database connected successfully'))
    .catch( (err) => console.log('Error: ' + err))

//USER REGISTER
router.post('/signup', async (req, res) => {
    let { firstname, lastname, email, username, password, telephone, state, gender, birthdate} = req.body;
    email = email.toLowerCase();
    username = username.toLowerCase()
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
            }).then( (nickname) => {
                if(nickname){ 
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
    email = email.toLowerCase();
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

//USER UPDATE ACCOUNT (NOTE: User can not update their email or username)
router.post('/user/:userId/profile', async (req, res) => {
    let {firstname, lastname, telephone, state, gender, 
         birthdate, country, city, relationship_status,
         work, school, about_me } = req.body;
    const id = req.params.userId;
    
    Users.update(
        {
            firstname,
            lastname,
            telephone,
            state,
            gender,
            birthdate,
            country,
            city,
            relationship_status,
            work,
            school,
            about_me
        },
        { where: { id } }
    ).then( (user) => {
        res.status(201).json({
            status: 'Profile updated successfully',
            data: user
        })
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//USER UPLAOD PROFILE PICTURE
router.post('/avatar', async (req, res) => {
    let avatar = req.files.avatar;
})

//USER UPDATE PROFILE PICTURE

//USER UPDATE PASSWORD

//GET USER PROFILE
router.get('/user/:userId', async (req, res) => {
    const id = req.params.userId;
    //Find and return the user account with id = userId
    Users.findOne({
        where: { id }
    }).then( (user) => {
        res.status(200).json({
            data: user
        })
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})


module.exports = router
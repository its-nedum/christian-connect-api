const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUserId = require('../helpers/getUserId')
const authenticate = require('../middleware/authenticate')

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
            message: "Please all fields are required"
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
                        message: "Username is already taken"
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
                                let userId = user.id;
                                const token = jwt.sign({name, email, username, userId}, process.env.SECRET_TOKEN, {expiresIn: '7d'})
                                res.status(201).json({
                                    message: 'Account created successfully',
                                    data: {
                                    user,
                                    token
                                    }
                                })
                            }).catch( (err) => console.log(err))    
                        
                        }
                    ).catch( (error) => {
                        res.status(500).json({ error: 'Something went wrong, Please try again later..'})
                    })

                }
            }).catch( (err) => {
                res.status(500).json({
                    error: "Something went wrong, please try again later"
                })
            })
        }
        
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
    
})

//USER LOGIN
router.post('/signin', async (req, res) => {
    let { email, password} = req.body
    email = email.toLowerCase();
    //Perform validation
    if(!email || !password){
       return res.status(200).json({
            message: 'All fields are required'
        })
    }

    //Verify user email
    const emailChecked = /\S+@\S+\.\S+/.test(email);
    if(!emailChecked){
        return res.status(200).json({message: 'Please enter a valid email'})
    }

    //Check if user account exists
    Users.findOne({
        where: { email }
    }).then( (user) => {
        if(user == null){
            return res.status(200).json({
                message: 'The credentials you provided does not exist'
            })
        }else{
           //Compare password with DB password
            let dbpassword = user.password;
            bcrypt.compare(password, dbpassword).then(
                (valid) => {
                    if(valid == false){
                        return res.status(200).json({message: 'The credentials you provided is incorrect'}) 
                    }
                    //Prepare JWT payload
                    const name = user.firstname + ' ' + user.lastname;
                    const username = user.username;
                    const userId = user.id;
                    jwt.sign({name, email, username, userId}, process.env.SECRET_TOKEN, {expiresIn: '7d'}, (err, token) => {
                        if(err) { console.log(err) }

                        res.status(200).json({
                            message: 'Login was successful',
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

    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})


//USER UPDATE ACCOUNT (NOTE: User can not update their email or username)
router.patch('/update-profile', authenticate, async (req, res) => {
    let {firstname, lastname, telephone, state, gender, 
         birthdate, country, city, relationship_status,
         work, school, about_me } = req.body;
    const id = await getUserId(req);
    
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
            message: 'Profile updated successfully',
            data: user
        })
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })
})

//USER UPLAOD PROFILE PICTURE
router.post('/avatar', authenticate, async (req, res) => {
    let avatar = req.files.avatar;
    const userId = await getUserId(req)

    if(avatar.mimetype !== 'image/jpeg' || avatar.mimetype !== 'image/png' || avatar.mimetype !== 'image/jpg') {
        return res.status(415).json({
            message: 'Please upload a image file',  
            })
      }

      cloudinary.uploader.upload(avatar.tempFilePath, {resource_type: 'auto', folder: 'Christian Connect/profilepics'}, async (err, result) => {
          if(err) { console.log(err) }
            Users.update({ avatar: result.secure_url},
                {where: {userId}}
                ).then( (user) => {
                    res.status(201).json({
                        message: "Profile picture updated successfully"
                    })
                }).catch( (err) => {
                    res.status(500).json({
                        error: "Something went wrong, please try again later"
                    })
                })
      }) 
})



//USER UPDATE PASSWORD
router.patch('/change-password', authenticate, async (req, res) => {
    let {current_password, new_password, confirm_password} = req.body
    const userId = await getUserId(req)
    //Check whether new password match confirm password
    if(new_password !== confirm_password){
        return res.status(500).json({
            message: "Password does not match"
        })
    }
 
    Users.findOne({
        where: {id: userId}
    }).then( (user) => {
        let dbpassword = user.password;
        bcrypt.compare(current_password, dbpassword).then(
            (valid) => {
                if(valid == false){
                    return res.status(400).json({message: 'The password you provided is incorrect'})
                }
                bcrypt.hash(new_password, 8).then(
                    (hash) => {
                        Users.update({password: hash},
                            {where: {id: userId}}
                            ).then( (result) => {
                                res.status(201).json({
                                    message: "Password updated successfully"
                                })
                            }).catch( err => {
                                res.status(500).json({
                                    error: "Something went wrong, please try again later"
                                })
                            })
                    }
                )
            }
        )
    }).catch( (err) => {
        res.status(500).json({
            error: "Something went wrong, please try again later"
        })
    })

})

//GET USER PROFILE
router.get('/user-details', authenticate, async (req, res) => {
    const id = await getUserId(req) //req.params.userId;
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

//USER UPDATE PROFILE PICTURE

module.exports = router
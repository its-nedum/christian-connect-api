const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//IMPORT DATABASE CONNECTION
const client = require('../database/dbconnect')

//CREATE ADMIN ACCOUNT
router.post('/create-admin', async (req, res) => {
    //collect form data
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const adminType = req.body.adminType

    try{
        //Check if the admin email already exist
        await client.query("SELECT * FROM admins WHERE email = $1", [email], async (err, result) => {
            if(err) { console.log(err) }

            //If email exist do this
            if(result.rows[0]){
                return res.status(400).json({
                    message: 'Admin already exist'
                })

            }else{
                //If email does not exist
                bcrypt.hash(password, 8).then(
                    (hash) => {
                        const hashPassword = hash;
                        client.query("INSERT INTO admins(firstname, lastname, email, username, password, admin_type, created_at)VALUES($1,$2,$3,$4,$5,$6, current_timestamp)",
                                    [firstname, lastname, email, username, hashPassword, adminType], (err) => {
                            if(err){
                                console.log(err)
                            }
                            //Prepare JWT payload
                            const name = firstname + ' ' + lastname;
                            jwt.sign({name, email, adminType}, process.env.SECRET_TOKEN, {expiresIn: '7d'}, (err, token) => {
                                //NOTE: Need to send token as part of header or to local storage then redirect user to dashboard
                                res.status(201).json({
                                status: 'success',
                                message: 'Admin account created successfully',
                                data: {
                                    firstname,
                                    lastname,
                                    email,
                                    username,
                                    password: hashPassword,
                                    adminType,
                                    token
                                    }
                                })
                            });
                        })
                    }
                ).catch(
                    (error) => {
                        res.status(500).json({
                            error: error
                        });
                    }
                )
            }
        })
    }catch(err){
        console.log(err)
    }
})


//SIGN IN AN ADMIN
router.post('/signin-admin', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    try{
        //Perform some validation check
        //check if email and password is empty
        if(!email || !password){
            return res.status(400).json({message: 'Some values are missing'})
        }
        //check email validity
        const checkedEmail = /\S+@\S+\.\S+/.test(email);
        if(!checkedEmail){
            return res.status(400).json({message: 'Please enter a valid email'})
        }

        await client.query("SELECT * FROM admins WHERE email = $1", [email], (err, result) => {
            if(err) { console.log(err) }

            if(!result.rows[0]){
                return res.status(400).json({
                    message: 'The credentials you provided does not exist'
                })
            }

            //check if the password match the hashed password in database
        let dbpass = result.rows[0].password;
        bcrypt.compare(password, dbpass).then(
            (valid) => {
                if(valid == false){
                    return res.status(400).json({message: 'The credentials you provided is incorrect'}) 
                }
                //Prepare JWT payload
                const name = result.rows[0].firstname + ' ' + result.rows[0].lastname;
                const adminType = result.rows[0].admin_type;
            jwt.sign({name, email, adminType}, process.env.SECRET_TOKEN, {expiresIn: '7d'}, (err, token) => {
                    if(err){console.log(err)}
                    
                res.status(200).json({
                message: 'success',
                data: {
                    token,
                    adminId: result.rows[0].id
                    }
                })
            });

        }).catch(
                (error) => {
                    res.status(500).json({
                        error: error
                    });
                }
            );
        })

    }catch(err){
        console.log(err)
    }
})




module.exports = router;
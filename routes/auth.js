const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const requireLogin = require(('../middleware/requireLogin'))

router.post('/signup', (req, res) => {
  const { name, email, password, pic } = req.body
  if (!name || !email || !password) {
    return res.status(422).json({ error: 'Please add all the fields' })
  }
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: 'User with this email already exists' })
      }
      bcrypt.hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name,
            email,
            password:hashedPassword,
            pic
          })
          user.save()
            .then((user) => {
              res.json({ message: "Successfully Saved User" })
            })
            .catch(err => console.log(err))
        })
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/signin', (req, res) => {
  const {email, password} = req.body
  if(!email || !password){
    return res.status(422).json({message: "Please provide email and password"})
  }
  User.findOne({email: email})
  .then(savedUser=>{
    if(!savedUser){
      return res.status(422).json({error: "Invalid Email or Password"})
    }
    bcrypt.compare(password, savedUser.password)
    .then(doMatch=>{
      if(doMatch){
        // return res.status(200).json({message: "Successfully Signed in"})
        const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
        const {_id, name, email, followers, following, pic} = savedUser
        res.send({token, user:{_id, name, email, followers, following, pic}})
      }
      else {
        return res.status(422).json({error: "Invalid Email or Password"})
      }
    })
    .catch(err=>{
      console.log(err);
    })
  })
})

module.exports = router
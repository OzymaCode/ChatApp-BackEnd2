const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const Schema = mongoose.Schema

// connect to mongodb
let dbURI =
  'mongodb+srv://guest:guest@cluster0.3gcrc.mongodb.net/ChatApp?retryWrites=true&w=majority'
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => app.listen(process.env.PORT || 5000))
  .catch((error) => console.log(error))

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)

const messageSchema = new Schema(
  {
    username: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true },
)

const Message = mongoose.model('Message', messageSchema)

app.use(express.json())

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET         	/
* Description	sets users array to empty (clears it), and returns the index.html file
* Author		Toby Martiny
* Date	        6/15/2022
* @res.sendFile     __dirname + '/client/public/index.html'
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.get('/', (req, res) => {
  users = []
  // res.sendFile(__dirname + '/client/public/index.html')
  res.send('success nice!')
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET         	/users
* Description	returns users array
* Author		Toby Martiny
* Date	        6/15/2022
* @res.json     array users
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.get('/users', (req, res) => {
  User.find()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* POST      	/users/signup
* Description	takes in a username and password, stores them in the users database,
                returns the user back to the caller after complete
* Author		Toby Martiny
* Date	        6/15/2022
* @req.body     {username: req.body.username, password: req.body.password}
* @res.json     {username: req.body.username, password: req.body.password}
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post('/users/signup', (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  })
  user
    .save()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* POST      	/users/login
* Description	takes in a username and password, compares them to existing users in 
                database. Determines if, users exists and if password is correct,
                then returns status
* Author		Toby Martiny
* Date	        6/15/2022
* @req.body     {username: req.body.username, password: req.body.password}
* @res.json     { 'status' : status, 'statusCode': statusCode }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post('/users/login', (req, res) => {
  let status = ''
  let statusCode = -1
  let thisUser
  // let thisUser = users.find((user) => user.username == req.body.username)
  User.findOne({ username: req.body.username }, (error, thisUser) => {
    if (error) console.log(error)
    else {
      if (thisUser == null) {
        status = 'User not found'
        statusCode = -1
      } else if (thisUser.password == req.body.password) {
        status = 'Success!'
        statusCode = 1
      } else {
        status = 'Incorrect Password'
        statusCode = 0
      }

      res.json({ status: status, statusCode: statusCode })
    }
  })
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET         	/clear
* Description	sets users database to empty
* Author		Toby Martiny
* Date	        6/15/2022
* @res.json     array users - ie: []
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.get('/clear', (req, res) => {
  // users = []
  // res.json(users)
  Message.drop()
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* POST         	/users/post
* Description	takes in a username and message, stores them in array 'messages' and
                returns the message to the sender
* Author		Toby Martiny
* Date	        6/15/2022
* @req          { username: req.body.username, message: req.body.message }
* @res.json     { username: req.body.username, message: req.body.message }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.post('/users/post', (req, res) => {
  const message = new Message({
    username: req.body.username,
    message: req.body.message,
  })
  message
    .save()
    .then(() => {
      Message.find()
        .then((result) => {
          res.json(result)
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch((error) => {
      console.log(error)
    })
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
* GET         	/users/post
* Description	  returns all the messages
* Author		    Toby Martiny
* Date	        6/29/2022
* @res.json     messages database
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
app.get('/users/post', (req, res) => {
  Message.find()
    .then((result) => {
      res.json(result)
    })
    .catch((error) => {
      console.log(error)
    })
})

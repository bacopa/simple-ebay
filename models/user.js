var mongoose = require("mongoose");
var moment = require("moment");
var bcrypt = require("bcryptjs");
var jwt = require('jsonwebtoken');
var JWT_SECRET = "secret";

//const JWT_SECRET = process.env.JWT_SECRET;
//if(!JWT_SECRET) {
//   throw new Error('Missing JWT_SECRET');
// }

var userSchema = new mongoose.Schema({
  
  email: { type: String, required: true },
  password: { type: String, required: true },
  auctions: [{
    type: mongoose.Schema.Types.ObjectId, ref: "Auction"
  }],
  bids: [{
    value: { type: Number }, 
    auction: { type: mongoose.Schema.Types.ObjectId, ref: "Auction" }
  }]

});

userSchema.statics.findAllAndPopulate = function(cb) {
  console.log("findAllAndPopulate");
  User.find({})
    .populate("auctions")
    .exec(function (err, users) {
      if(err){ 
        return cb(err) 
      }
      
      cb(null, users);
    })    
};

userSchema.statics.isLoggedIn = function(req, res, next) {
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({error: 'Must be authenticated.'});

    User
      .findById(payload._id)
      .select({password: false})
      .exec((err, user) => {
        if(err || !user) {
          return res.clearCookie('accessToken').status(400).send(err || {error: 'User not found.'});
        }
        console.log(user);
        req.user = user;
        next();
      });
  });
};

userSchema.statics.register = function(userObj, cb) {
  User.findOne({email: userObj.email}, (err, dbUser) => {
    if(err || dbUser) return cb(err || { error: 'email not available.' })


    bcrypt.hash(userObj.password, 10, (err, hash) => {
      if(err) return cb(err);

      var user = new User({
        email: userObj.email,
        password: hash
      });

      user.save(cb);
    });
  });
};

userSchema.statics.authenticate = function(userObj, cb) {
  // find the user by the username
  // confirm the password

  // if user is found, and password is good, create a token
  this.findOne({username: userObj.username}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || { error: 'Login failed. Username or password incorrect.' });

    bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
      if(err || !isGood) return cb(err || { error: 'Login failed. Username or password incorrect.' });

      var token = dbUser.makeToken();

      cb(null, token);
    });
  });
};

userSchema.methods.makeToken = function() {
  var token = jwt.sign({
    _id: this._id,
    exp: moment().add(1, 'day').unix() // in seconds
  }, JWT_SECRET);
  return token;
};

//moved this down here and it may have worked
var User = mongoose.model('User', userSchema);

module.exports = User;
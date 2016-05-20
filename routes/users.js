var express = require('express');
var router = express.Router();

var User = require('../models/user');

// too lazy to create function in model that calls db
router.get('/users', (req, res) => {
  User.findAllAndPopulate( (err, users) => { 	
    res.status(err ? 400 : 200).send(err || users);
  });
});
	
//users/register
router.post('/register', (req, res) => {
  User.register(req.body, err => {
    res.status(err ? 400 : 200).send(err);
  });
});



module.exports = router;
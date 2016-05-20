var express = require('express');
var router = express.Router();

var Auction = require('../models/auction');

//wrote find call to db here
router.get('/auctions', (req, res) => {
  Auction.find({}, (err, auctions) => {
    res.status(err ? 400 : 200).send(err || auctions);
  });
});


router.post("/auction/:userId", (req, res) => {

	req.body._userId = req.params.userId;

	Auction.createAuction(req.body, function (err, auction) {
		console.log(auction);
		res.status(err ? 400 : 200 ).send(err || auction );
	});
});

router.put("/auction/:auctionId/user/:userId", function (req, res) {

	req.body._auctionId = req.params.auctionId;
	req.body._userId = req.params.userId;

	Auction.placeBid(req.body, function (err, auction){
		console.log("err", err);
		res.status(err ? 400 : 200 ).send(err || auction);
	});
});

router.get("/auction/:auctionId", function (req, res) {
	console.log("get auction:",	req.params.auctionId);
	Auction.getOne(req.params.auctionId, function (err, auction) {
		console.log("err", err);
		res.status(err ? 400 : 200 ).send(err || auction);
	});
});


module.exports = router;


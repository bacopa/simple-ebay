var mongoose = require("mongoose");
var moment = require("moment");
var User = mongoose.model('User');


var auctionSchema = new mongoose.Schema({

	_owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

	item: { type: String, required: true },
	exp: { type: Date},
	bidders: [{
		value: { type: Number },
		user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
	}]
});

auctionSchema.statics.createAuction = function (auctionObj, cb) {

	User.findById(auctionObj._userId, function (err, user) {
		var auction = new Auction({

			_owner: user._id,
			item: auctionObj.item,
			exp: moment().add(1, "day").unix(),
			bidders: []
		});

		user.auctions.push(auction);
		console.log(auction);
		auction.save(function (err) {
			user.save(function (err, auction) {
				if(err){cb(err)}
				cb(null, auction);
			})
		})
	})
};

auctionSchema.statics.placeBid = function (obj, cb){

	var userId = obj._userId;
	var auctionId = obj._auctionId;

	var userBid = {
		value: obj.value,
		auction: auctionId
	};
	var auctionBid = {
		value: obj.value,
		user: userId
	};

	Auction.findById( auctionId, function (err, auction){
		if(err){ cb(err) }
		if( auction.bidders.indexOf(userId)){
			return cb("You cannot bid on your auction!");
		}
		
		auction.bidders.push(auctionBid);

		auction.save(function (err){
			User.findById( userId, function (err, user){
				if(err){ cb(err) }
				user.bids.push(userBid);
				user.save(function (err, auction){
					if(err){ cb(err) }
					cb(null, auction);
				})
			})
		})
	})
};

auctionSchema.statics.getOne = function (auctionId, cb){
	Auction.findById( auctionId, function (err, auction){
		 if(err){ cb(err) };
		 cb(null, auction);
	});
};



//must be below methods
var Auction = mongoose.model("Auction", auctionSchema);
module.exports = Auction;

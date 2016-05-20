var app = angular.module("auctionApp", ["ui-router"]);

app.config(function ($urlRouterProvider, $stateProvider){

	$stateProvider
	.state( "/", {
		url: "/auctions",
		templateUrl: "/partials/auctions.html",
		controller: "auctionCtrl"
	})
	.state("/user", {
		url: "/user/:userId",
		templateUrl: "/partials/user.html",
		controller: "userCtrl"
	})
}
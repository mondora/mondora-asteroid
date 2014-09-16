// Set the ALLOWED_ORIGIN variable
var ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
if (!ALLOWED_ORIGIN) {
	console.warn("You have not specified any allowed origin.");
	console.warn("For ease of development, this will make any origin allowed, making the app insecure.");
	console.warn("In production, remember to specify the origin.");
	console.warn("If you wish not to allow any origin, set it to NONE.");
	ALLOWED_ORIGIN = "*";
}
if (ALLOWED_ORIGIN === "NONE") {
	ALLOWED_ORIGIN = Meteor.absoluteUrl();
	return;
}

// Add the cross-origin header to http requests
Meteor.startup(function () {
	WebApp.connectHandlers.use(function (req, res, next) {
		res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
		return next();
	});
});

// Overwrite the popup template
OAuth._endOfPopupResponseTemplate = Assets.getText("asteroid-oauth-popup.html")
	.replace("##ALLOWED_ORIGIN##", ALLOWED_ORIGIN)
	.replace("##SCRIPT##", Assets.getText("asteroid-oauth-popup.js"));

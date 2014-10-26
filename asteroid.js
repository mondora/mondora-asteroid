var ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
if (!ALLOWED_ORIGIN) {
	ALLOWED_ORIGIN = "*";
}

if (ALLOWED_ORIGIN === "NONE") {
	OAuth.allowedOrigin = Meteor.absoluteUrl();
} else {
	OAuth.allowedOrigin = ALLOWED_ORIGIN;
}

// Overwrite the popup template
OAuth._endOfPopupResponseTemplate = Assets.getText("end_of_popup_response.html")
	.replace("##ALLOWED_ORIGIN##", OAuth.allowedOrigin)
	.replace("##SCRIPT##", Assets.getText("end_of_popup_response.js"));

// Overwrite the redirect origin checking function to allow
// our alternative origin
OAuth._checkRedirectUrlOrigin = function (redirectUrl) {
	var appHost = Meteor.absoluteUrl();
	var appHostReplacedLocalhost = Meteor.absoluteUrl(undefined, {
		replaceLocalhost: true
	});
	return (
		redirectUrl.substr(0, appHost.length) !== appHost &&
		redirectUrl.substr(0, appHostReplacedLocalhost.length) !== appHostReplacedLocalhost &&
		redirectUrl.substr(0, OAuth.allowedOrigin.length) !== OAuth.allowedOrigin
	);
};

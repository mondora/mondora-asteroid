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

// Overwrite the redirect template
OAuth._endOfRedirectResponseTemplate = Assets.getText("end_of_redirect_response.html")
	.replace("##ALLOWED_ORIGIN##", OAuth.allowedOrigin)
	.replace("##SCRIPT##", Assets.getText("end_of_redirect_response.js"));

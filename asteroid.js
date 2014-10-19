var ALLOWED_OAUTH_ORIGINS = process.env.ALLOWED_OAUTH_ORIGINS;
if (!ALLOWED_OAUTH_ORIGINS) {
	ALLOWED_OAUTH_ORIGINS = "*";
}

if (ALLOWED_OAUTH_ORIGINS === "NONE") {
	OAuth.allowedOrigins = [Meteor.absoluteUrl()];
} else {
	OAuth.allowedOrigins = ALLOWED_OAUTH_ORIGINS.split(",");
}

var allowedOrigins = JSON.stringify(OAuth.allowedOrigins);

// Overwrite the popup template
OAuth._endOfPopupResponseTemplate = Assets.getText("end_of_popup_response.html")
	.replace("##ALLOWED_OAUTH_ORIGINS##", allowedOrigins)
	.replace("##SCRIPT##", Assets.getText("end_of_popup_response.js"));

// Overwrite the redirect template
OAuth._endOfRedirectResponseTemplate = Assets.getText("end_of_redirect_response.html")
	.replace("##ALLOWED_OAUTH_ORIGINS##", allowedOrigins)
	.replace("##SCRIPT##", Assets.getText("end_of_redirect_response.js"));

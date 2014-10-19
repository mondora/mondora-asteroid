function storeAndClose () {

	var config = JSON.parse(
		document.getElementById("config").innerHTML
	);
	var allowedOrigins = JSON.parse(
		document.getElementById("allowed-oauth-origins").innerHTML
	);

	if (config.setCredentialToken) {

		var credentialToken = config.credentialToken;
		var credentialSecret = config.credentialSecret;

		// Response that will be sent in a few cases
		var credentialString = JSON.stringify({
			credentialToken: credentialToken,
			credentialSecret: credentialSecret
		});

		/*
		 *  We employ a few different strategies to communicate
		 *  the secret back to the opener window
		 */

		// Try to set the token in localStorage
		// Needed for apps that use the meteor frontend
		localStorage[config.storagePrefix + credentialToken] = credentialSecret;

		// Try to post a message to the opener
		// Needed since safari on iOS pauses timers in background tabs
		allowedOrigins.forEach(function (allowedOrigin) {
			try {
				window.opener.postMessage(credentialString, allowedOrigin);
			} catch (e) {
				// Do nothing
			}
		});

		// Write the two tokens (stringified) in the hash fragment
		// Needed to support cordova
		window.location.hash = credentialString;

		// Reply to messages asking for the secret (only if coming form allowed origins)
		// Needed where window.opener is not available
		window.addEventListener("message", function (e) {
			var message = JSON.parse(e.data);
			if (
				message.credentialToken === credentialToken &&
				(allowedOrigins.indexOf(e.origin) !== -1 ||
				allowedOrigins.indexOf("*") !== -1)
			) {
				e.source.postMessage(credentialString, e.origin);
			}
		});

	}

	if (!config.isCordova) {
		document.getElementById("completedText").style.display = "block";
	}

}

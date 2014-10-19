function storeAndClose () {

	var config = JSON.parse(document.getElementById("config").innerHTML);
	var allowedOrigin = document.getElementById("allowed-origin").innerHTML;

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
		try {
			localStorage[config.storagePrefix + credentialToken] = credentialSecret;
		} catch (e) {
			// Do nothing
		}

		// Try to call a function in the opener
		// Needed for apps that use the meteor frontend
		try {
			window.opener.Package.oauth.OAuth._handleCredentialSecret(credentialToken, credentialSecret);
			window.close();
		} catch (e) {
			// Do nothing
		}

		// Try to post a message to the opener
		// Needed since safari on iOS pauses timers in background tabs
		try {
			window.opener.postMessage(credentialString, allowedOrigin);
			window.close();
		} catch (e) {
			// Do nothing
		}

		// Write the two tokens (stringified) in the hash fragment
		// Needed to support cordova
		window.location.hash = credentialString;

		// Reply to messages asking for the secret (only if coming form allowed origins)
		// Needed where window.opener is not available
		window.addEventListener("message", function (e) {
			var message;
			try {
				message = JSON.parse(e.data);
			} catch (err) {
				window.close();
				return;
			}
			if (
				message.credentialToken === credentialToken &&
				(allowedOrigin.indexOf(e.origin) !== -1 ||
				allowedOrigin === "*")
			) {
				e.source.postMessage(credentialString, e.origin);
				window.close();
			}
		});

	}

	if (!config.isCordova) {
		document.getElementById("completedText").style.display = "block";
		window.close();
	}

}

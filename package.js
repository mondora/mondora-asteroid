Package.describe({
	summary: "Configures Meteor to be used with Asteroid",
	name: "mondora:asteroid",
	version: "0.4.0",
	git: "https://github.com/mondora/mondora-asteroid.git"
});

Package.onUse(function (api) {
	api.versionsFrom("METEOR@0.9.0");
	api.use("webapp", "server");
	api.use("logging", "server");
	api.use("oauth", "server");
	api.addFiles("asteroid.js", "server");
	api.addFiles("asteroid-oauth-popup.html", "server", {isAsset: true});
	api.addFiles("asteroid-oauth-popup.js", "server", {isAsset: true});
});

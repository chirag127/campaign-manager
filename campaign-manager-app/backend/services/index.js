const facebookService = require("./facebookService");
const googleService = require("./googleService");
const youtubeService = require("./youtubeService");
const linkedinService = require("./linkedinService");
const twitterService = require("./twitterService");
const snapchatService = require("./snapchatService");

module.exports = {
    facebook: facebookService,
    instagram: facebookService, // Instagram uses Facebook's API
    google: googleService,
    youtube: youtubeService,
    linkedin: linkedinService,
    twitter: twitterService,
    snapchat: snapchatService,
};

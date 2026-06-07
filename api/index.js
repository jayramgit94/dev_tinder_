require("dotenv").config({ path: require("path").join(__dirname, "..", "tinder_backend", ".env") });

const createApp = require("../tinder_backend/src/createApp");

module.exports = createApp();

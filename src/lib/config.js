require("dotenv").config();

module.exports = {
    loginUrl: process.env.SF_LOGIN_URL,
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD,
};

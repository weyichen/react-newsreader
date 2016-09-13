const PRODUCTION_MODE = false;
const PORT = 5000;

const MONGODB_URI = 'mongodb://heroku_jwmv0642:vsjp1seocg6di61eo4vv1hogei@ds015924.mlab.com:15924/heroku_jwmv0642';

const SESSION_SECRET = 'keyboard cat';
const COOKIE_MAXAGE = 3600000;

module.exports = {
	PRODUCTION_MODE: PRODUCTION_MODE,
	PORT: PORT,
	MONGODB_URI: MONGODB_URI,
	SESSION_SECRET: SESSION_SECRET,
	COOKIE_MAXAGE: COOKIE_MAXAGE
};
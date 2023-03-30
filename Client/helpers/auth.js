const logging = require('../helpers/logging');

const NAMESPACE = 'AUTH';



const authUser = function (req, res, next) {
	// your validation code goes here.
	logging.info(NAMESPACE, 'authUser', 'Authenticating Request');
	var isAuthenticated = false;
	if (req.session.accessToken) {
		isAuthenticated = true;
	}

	if (isAuthenticated) {
		next();
	} else {
		//req.session.destroy();
		res.redirect('/login');
	}
};

module.exports = { authUser };

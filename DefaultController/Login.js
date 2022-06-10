const ControllerBase = require('../ControllerBase');
const Utility = require('./../Utility');
const LoginHelper = require('./../LoginHelper');

class Login extends ControllerBase {
    isAuthEnabled = false;
    async execute(http) {
        let response = { success: false, message: '' };
        if (Utility.isNullOrEmpty(http.params["email"]) && Utility.isNullOrEmpty(http.params["username"])) {
            response.message = "Please Enter Valid credentials";
            return response;
        }
        if (Utility.isNullOrEmpty(http.params["password"])) {
            response.message = "Please enter your password";
            return response;
        }
        const args = {};
        if (!Utility.isNullOrEmpty(http.params["email"])) {
            args.email = http.params["email"];
        }
        if (!Utility.isNullOrEmpty(http.params["username"])) {
            args.username = http.params["username"];
        }
        args.password = http.params["password"];
        response = await LoginHelper.login(args, http);
        return response;
    }
}
module.exports = Login;
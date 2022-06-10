const ControllerBase = require('./../ControllerBase');
const LoginHelper = require('./../LoginHelper');

class ChangePassword extends ControllerBase {
    isAuthEnabled = true;

    async execute(http) {
        const response = await LoginHelper.login({ email: http.params.email, password: http.params.password });
        if (response.success) {
            return await LoginHelper.changePassword({ userId: response.user._id, password: http.params.newPassword });
        }
        return response;
    }
};
module.exports = ChangePassword;
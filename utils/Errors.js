const httplease = require("httplease");

class HttpErrorHandler {
    static bailOut(err, required_permission_name) {
        HttpErrorHandler.showPrettyError(err, required_permission_name)
        process.exit(1);
    }

    static showPrettyError(err, required_permission_name) {
        if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
            if (err.response.statusCode == 401) {
                console.log("Not authorized, the api key in config.js seems invalid");
            } else if (err.response.statusCode == 403) {
                console.log("Forbidden, your token lacks the " + required_permission_name + " permission");
            } else {
                console.log("HTTP error: " + err.response.statusCode);
                console.log(err.response.body);
            }
        } else {
            console.log(err.message);
        }
    }
}

module.exports = HttpErrorHandler;
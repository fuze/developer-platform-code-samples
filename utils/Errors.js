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
                console.log(JSON.stringify(err.response.body, null, 2))
            } else {
                console.log("HTTP error: " + err.response.statusCode);
                console.log(JSON.stringify(err.response.body, null, 2));
            }
        } else {
            console.log(err.message);
        }
    }

    static getHttpError(err) {
        if (err instanceof httplease.errors.UnexpectedHttpResponseCodeError) {
            return err.response.statusCode;
        } else {
            return null;
        }
    }
}

module.exports = HttpErrorHandler;